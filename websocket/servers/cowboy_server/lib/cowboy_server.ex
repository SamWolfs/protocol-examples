defmodule CowboyServer do
  use Application

  @moduledoc """
  Documentation for `CowboyServer`.
  """

  def start(_, _) do
    import Supervisor.Spec, warn: false

children = [
      {Plug.Cowboy, scheme: :http, plug: MyPlug, options: [port: 4001]}
    ]

    opts = [strategy: :one_for_one, name: __MODULE__]
    Supervisor.start_link([], opts)
  end

  defp dispatch do
    [
      {:_,
       [
         {"/", CowboyServer.SocketHandler, []}
       ]}
    ]
  end
end
