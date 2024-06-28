import { PageDto } from '@/core/models';
import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkResponsePaginated = <ContentType extends Type<unknown>>(
  contentType: ContentType,
) =>
  applyDecorators(
    ApiExtraModels(PageDto, contentType),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              contents: {
                type: 'array',
                items: { $ref: getSchemaPath(contentType) },
              },
            },
          },
        ],
      },
    }),
  );
