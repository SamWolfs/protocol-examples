/* eslint-disable */
import * as Long from "long";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "example";

export interface Command {
  echo: Echo | undefined;
  increment: Increment | undefined;
}

export interface Echo {
  msg: string;
}

export interface Increment {
  value: number;
}

function createBaseCommand(): Command {
  return { echo: undefined, increment: undefined };
}

export const Command = {
  encode(
    message: Command,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.echo !== undefined) {
      Echo.encode(message.echo, writer.uint32(810).fork()).ldelim();
    }
    if (message.increment !== undefined) {
      Increment.encode(message.increment, writer.uint32(818).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Command {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommand();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 101:
          message.echo = Echo.decode(reader, reader.uint32());
          break;
        case 102:
          message.increment = Increment.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Command {
    return {
      echo: isSet(object.echo) ? Echo.fromJSON(object.echo) : undefined,
      increment: isSet(object.increment)
        ? Increment.fromJSON(object.increment)
        : undefined,
    };
  },

  toJSON(message: Command): unknown {
    const obj: any = {};
    message.echo !== undefined &&
      (obj.echo = message.echo ? Echo.toJSON(message.echo) : undefined);
    message.increment !== undefined &&
      (obj.increment = message.increment
        ? Increment.toJSON(message.increment)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Command>, I>>(object: I): Command {
    const message = createBaseCommand();
    message.echo =
      object.echo !== undefined && object.echo !== null
        ? Echo.fromPartial(object.echo)
        : undefined;
    message.increment =
      object.increment !== undefined && object.increment !== null
        ? Increment.fromPartial(object.increment)
        : undefined;
    return message;
  },
};

function createBaseEcho(): Echo {
  return { msg: "" };
}

export const Echo = {
  encode(message: Echo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.msg !== "") {
      writer.uint32(10).string(message.msg);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Echo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEcho();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.msg = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Echo {
    return {
      msg: isSet(object.msg) ? String(object.msg) : "",
    };
  },

  toJSON(message: Echo): unknown {
    const obj: any = {};
    message.msg !== undefined && (obj.msg = message.msg);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Echo>, I>>(object: I): Echo {
    const message = createBaseEcho();
    message.msg = object.msg ?? "";
    return message;
  },
};

function createBaseIncrement(): Increment {
  return { value: 0 };
}

export const Increment = {
  encode(
    message: Increment,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.value !== 0) {
      writer.uint32(8).int32(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Increment {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncrement();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Increment {
    return {
      value: isSet(object.value) ? Number(object.value) : 0,
    };
  },

  toJSON(message: Increment): unknown {
    const obj: any = {};
    message.value !== undefined && (obj.value = Math.round(message.value));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Increment>, I>>(
    object: I
  ): Increment {
    const message = createBaseIncrement();
    message.value = object.value ?? 0;
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
