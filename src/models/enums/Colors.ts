import { registerEnumType } from '@nestjs/graphql'

export enum Colors {
	YELLOW = 'YELLOW', WHITE = 'WHITE', RED = 'RED', GREEN = 'GREEN',
	BLUE = 'BLUE', PURPLE = 'PURPLE', ORANGE = 'ORANGE', CYAN = 'CYAN',
	BROWN = 'BROWN', MAGENTA = 'MAGENTA'
}

registerEnumType (Colors, {
	name: 'Colors'
})
