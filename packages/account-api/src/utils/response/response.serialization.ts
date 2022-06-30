import { ReferenceObject, SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { getSchemaPath } from "@nestjs/swagger/dist/utils";

export function getSchemaRespGen(jsonSchema?: any, isArray?: boolean): SchemaObject {
    let schema: SchemaObject;
    if (isArray) {
        schema = {
            "type": "object",
            "properties": {
                "statusCode": { "type": "integer" },
                "message": { "type": "string" },
                "data": {
                    "type": "array",
                    "items": jsonSchema
                }
            }
        }
    }
    else {
        schema = {
            "type": "object",
            "properties": {
                "statusCode": { "type": "integer" },
                "message": { "type": "string" },
                "data": jsonSchema
            }
        }
    }

    return schema;
}

export function getSchemaResp(dto?: any, isArray?: boolean): SchemaObject  | Partial<ReferenceObject>  {
    let schema: SchemaObject | Partial<ReferenceObject>;
    if (dto) {
        if (isArray)
            schema = {
                "type": "object",
                "properties": {
                    "statusCode": { "type": "integer" },
                    "message": { "type": "string" },
                    "data": {
                        "type": "array",
                        "items": { $ref: getSchemaPath(dto) }
                    }
                }
            }
        else {
            schema = {
                "type": "object",
                "properties": {
                    "statusCode": { "type": "integer" },
                    "message": { "type": "string" },
                    "data": { $ref: getSchemaPath(dto) }
                }
            }
        }
    }
    else {
        schema = {
            "type": "object",
            "properties": {
                "statusCode": { "type": "integer" },
                "message": { "type": "string" }
            }
        }
    }

    return schema;
}



// export abstract class Response<T> {
//     statusCode?: number;
//     message?: string;
//     data?: T;
// }