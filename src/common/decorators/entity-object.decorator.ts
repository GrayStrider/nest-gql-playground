import { composeClassDecorators } from '@qdev/utils-ts'
import { Entity } from 'typeorm'
import { ObjectType } from '@nestjs/graphql'

export const EntityObject = composeClassDecorators (ObjectType (), Entity ())
