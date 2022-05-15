defmodule WebsockexClient do
  use WebSockex
  require Logger

  alias Example.{Command, Echo, Increment}

  def start_link(opts \\ []) do
    WebSockex.start_link("ws://localhost:8080", __MODULE__, :fake_state, opts)
  end

  @spec echo(pid, String.t()) :: :ok
  def echo(client, message) do
    Logger.info("Sending message: #{message}")
    echo = Echo.new(msg: message)
    command = Command.new(payload: {:echo, echo})
    WebSockex.send_frame(client, {:binary, Command.encode(command)})
  end

  def increment(client, value) do
    inc = Increment.new(value: value)
    command = Command.new(payload: {:increment, inc})
    WebSockex.send_frame(client, {:binary, Command.encode(command)})
  end

  def handle_connect(_conn, state) do
    Logger.info("Connected!")
    {:ok, state}
  end

  def handle_frame({:text, msg}, :fake_state) do
    Logger.info("Received Message: #{msg}")
    {:ok, :fake_state}
  end

  def handle_frame({:binary, bin_msg}, :fake_state) do
    msg = Command.decode(bin_msg)
    Logger.info("Received Message: #{inspect(msg)}")
    {:ok, :fake_state}
  end

  def handle_disconnect(%{reason: {:local, reason}}, state) do
    Logger.info("Local close with reason: #{inspect(reason)}")
    {:ok, state}
  end

  def handle_disconnect(disconnect_map, state) do
    super(disconnect_map, state)
  end
end
