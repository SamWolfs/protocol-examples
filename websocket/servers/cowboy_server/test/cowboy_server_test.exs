defmodule CowboyServerTest do
  use ExUnit.Case
  doctest CowboyServer

  test "greets the world" do
    assert CowboyServer.hello() == :world
  end
end
