defmodule Example.Command do
  @moduledoc false
  use Protobuf, syntax: :proto3

  @type t :: %__MODULE__{
          payload: {:echo, Example.Echo.t() | nil} | {:increment, Example.Increment.t() | nil}
        }

  defstruct [:payload]

  oneof :payload, 0

  field :echo, 101, type: Example.Echo, oneof: 0
  field :increment, 102, type: Example.Increment, oneof: 0

  def transform_module(), do: nil
end

defmodule Example.Echo do
  @moduledoc false
  use Protobuf, syntax: :proto3

  @type t :: %__MODULE__{
          msg: String.t()
        }

  defstruct [:msg]

  field :msg, 1, type: :string

  def transform_module(), do: nil
end

defmodule Example.Increment do
  @moduledoc false
  use Protobuf, syntax: :proto3

  @type t :: %__MODULE__{
          value: integer
        }

  defstruct [:value]

  field :value, 1, type: :int32

  def transform_module(), do: nil
end
