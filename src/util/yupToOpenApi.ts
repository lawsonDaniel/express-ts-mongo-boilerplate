// src/utils/yupToOpenApi.ts
import * as yup from 'yup';

interface OpenApiProperty {
  type: string;
  format?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  enum?: string[];
  items?: OpenApiProperty;
  description?: string;
}

interface OpenApiSchema {
  type: string;
  properties: Record<string, OpenApiProperty>;
  required: string[];
}

export class YupToOpenApiConverter {
  static convertSchema(yupSchema: yup.ObjectSchema<any>): OpenApiSchema {
    const shape = yupSchema.describe();
    const properties: Record<string, OpenApiProperty> = {};
    const required: string[] = [];

    // Process each field in the schema
    Object.entries(shape.fields || {}).forEach(([fieldName, fieldDesc]: [string, any]) => {
      const property = this.convertField(fieldDesc);
      properties[fieldName] = property;

      // Check if field is required
      if (fieldDesc.tests?.some((test: any) => test.name === 'required')) {
        required.push(fieldName);
      }
    });

    return {
      type: 'object',
      properties,
      required
    };
  }

  private static convertField(fieldDesc: any): OpenApiProperty {
    const property: OpenApiProperty = {
      type: 'string' // default
    };

    // Handle different Yup types
    switch (fieldDesc.type) {
      case 'string':
        property.type = 'string';
        break;
      case 'number':
        property.type = 'number';
        break;
      case 'boolean':
        property.type = 'boolean';
        break;
      case 'array':
        property.type = 'array';
        if (fieldDesc.innerType) {
          property.items = this.convertField(fieldDesc.innerType);
        }
        break;
      case 'object':
        property.type = 'object';
        break;
      default:
        property.type = 'string';
    }

    // Process validation rules
    fieldDesc.tests?.forEach((test: any) => {
      switch (test.name) {
        case 'email':
          property.format = 'email';
          break;
        case 'min':
          if (property.type === 'string') {
            property.minLength = test.params?.min;
          } else {
            property.minimum = test.params?.min;
          }
          break;
        case 'max':
          if (property.type === 'string') {
            property.maxLength = test.params?.max;
          } else {
            property.maximum = test.params?.max;
          }
          break;
        case 'matches':
          property.pattern = test.params?.regex?.source;
          break;
        case 'oneOf':
          property.enum = test.params?.values;
          break;
      }
    });

    // Add description from label or meta
    if (fieldDesc.label) {
      property.description = fieldDesc.label;
    }

    return property;
  }

  // Generate complete OpenAPI components
  static generateComponents(validationSchemas: Record<string, yup.ObjectSchema<any>>) {
    const components: Record<string, OpenApiSchema> = {};

    Object.entries(validationSchemas).forEach(([schemaName, schema]) => {
      components[schemaName] = this.convertSchema(schema);
    });

    return {
      components: {
        schemas: components
      }
    };
  }
}