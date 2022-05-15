defmodule WebsockexClientTest do
  use ExUnit.Case
  doctest WebsockexClient

  test "greets the world" do
    assert WebsockexClient.hello() == :world
  end
end
