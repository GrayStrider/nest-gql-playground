import { truncate, capitalize } from 'lodash'
import { AnyObject } from 'tsdef'
import { ApolloError } from 'apollo-server-errors'


interface IExpectedError {
	details?: AnyObject | string
}

export enum ErrorCodes {
	'VALIDATION_ERROR' = 'VALIDATION_ERROR',
	'NOT_FOUND' = 'NOT_FOUND',
	'UNATHORIZED' = 'UNATHORIZED',
	LIMIT_REACHED = 'LIMIT_REACHED',
	NOT_UNIQUE = 'NOT_UNIQUE'
}

const Errors = {
	Validation: makeCustomError (ErrorCodes.VALIDATION_ERROR, 'Validation error'),
	NotFound: makeCustomError (ErrorCodes.NOT_FOUND, 'Object not found'),
	Unathorized: makeCustomError (ErrorCodes.UNATHORIZED, 'Unathorized to perform requested action'),
	InvalidCredentials: makeCustomError (ErrorCodes.UNATHORIZED, 'Invalid credentials provided'),
	NotUnique: makeCustomError (ErrorCodes.NOT_UNIQUE,
		'Unique constraint violation')
}

const userNotFoundError = (id: string) =>
	new Errors.NotFound (`User ${truncate (id, { length: 10 })} not found`)

const NotFoundByIDError = (name: string, id: string) =>
	new ApolloError (`${capitalize (name)} ${truncate (id, {
			length: 10
		})} was not found`,
		ErrorCodes.NOT_FOUND, {
			providedID: id
		})


function makeCustomError (
	code: ErrorCodes, defaultMessage: string,
	defaultDetails?: AnyObject | string
) {
	
	return class ExpectedError extends ApolloError implements IExpectedError {
		
		public details?: AnyObject | string
		
		constructor (message?: string, details?: AnyObject | string) {
			
			super (message ?? defaultMessage, code)
			this.details = details ?? defaultDetails ?? {}
			
		}
		
	}
	
}

export default Errors
export {
	userNotFoundError,
	makeCustomError,
	IExpectedError,
	NotFoundByIDError
}
