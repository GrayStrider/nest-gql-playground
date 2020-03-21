import { Like } from 'typeorm'
import { AnyObject } from 'tsdef'

export default function WrapperLike (object: AnyObject, key: string) {
	
	return { [key]: Like (`%${String (object[key])}%`) as unknown as string }
	
}
