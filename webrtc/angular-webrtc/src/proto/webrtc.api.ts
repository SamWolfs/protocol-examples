/* eslint-disable */
import * as Long from "long";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "webrtc";

export interface Envelope {
  sdpOffer: SdpOffer | undefined;
  sdpAnswer: SdpAnswer | undefined;
}

export interface SdpOffer {
  sdp: string;
}

export interface SdpAnswer {
  sdp: string;
}

function createBaseEnvelope(): Envelope {
  return { sdpOffer: undefined, sdpAnswer: undefined };
}

export const Envelope = {
  encode(
    message: Envelope,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sdpOffer !== undefined) {
      SdpOffer.encode(message.sdpOffer, writer.uint32(810).fork()).ldelim();
    }
    if (message.sdpAnswer !== undefined) {
      SdpAnswer.encode(message.sdpAnswer, writer.uint32(818).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Envelope {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnvelope();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 101:
          message.sdpOffer = SdpOffer.decode(reader, reader.uint32());
          break;
        case 102:
          message.sdpAnswer = SdpAnswer.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Envelope {
    return {
      sdpOffer: isSet(object.sdpOffer)
        ? SdpOffer.fromJSON(object.sdpOffer)
        : undefined,
      sdpAnswer: isSet(object.sdpAnswer)
        ? SdpAnswer.fromJSON(object.sdpAnswer)
        : undefined,
    };
  },

  toJSON(message: Envelope): unknown {
    const obj: any = {};
    message.sdpOffer !== undefined &&
      (obj.sdpOffer = message.sdpOffer
        ? SdpOffer.toJSON(message.sdpOffer)
        : undefined);
    message.sdpAnswer !== undefined &&
      (obj.sdpAnswer = message.sdpAnswer
        ? SdpAnswer.toJSON(message.sdpAnswer)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Envelope>, I>>(object: I): Envelope {
    const message = createBaseEnvelope();
    message.sdpOffer =
      object.sdpOffer !== undefined && object.sdpOffer !== null
        ? SdpOffer.fromPartial(object.sdpOffer)
        : undefined;
    message.sdpAnswer =
      object.sdpAnswer !== undefined && object.sdpAnswer !== null
        ? SdpAnswer.fromPartial(object.sdpAnswer)
        : undefined;
    return message;
  },
};

function createBaseSdpOffer(): SdpOffer {
  return { sdp: "" };
}

export const SdpOffer = {
  encode(
    message: SdpOffer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sdp !== "") {
      writer.uint32(10).string(message.sdp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SdpOffer {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSdpOffer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sdp = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SdpOffer {
    return {
      sdp: isSet(object.sdp) ? String(object.sdp) : "",
    };
  },

  toJSON(message: SdpOffer): unknown {
    const obj: any = {};
    message.sdp !== undefined && (obj.sdp = message.sdp);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SdpOffer>, I>>(object: I): SdpOffer {
    const message = createBaseSdpOffer();
    message.sdp = object.sdp ?? "";
    return message;
  },
};

function createBaseSdpAnswer(): SdpAnswer {
  return { sdp: "" };
}

export const SdpAnswer = {
  encode(
    message: SdpAnswer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sdp !== "") {
      writer.uint32(10).string(message.sdp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SdpAnswer {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSdpAnswer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sdp = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SdpAnswer {
    return {
      sdp: isSet(object.sdp) ? String(object.sdp) : "",
    };
  },

  toJSON(message: SdpAnswer): unknown {
    const obj: any = {};
    message.sdp !== undefined && (obj.sdp = message.sdp);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SdpAnswer>, I>>(
    object: I
  ): SdpAnswer {
    const message = createBaseSdpAnswer();
    message.sdp = object.sdp ?? "";
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
