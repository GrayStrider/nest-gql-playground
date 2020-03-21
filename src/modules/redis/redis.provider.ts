import Redis from 'ioredis'

export function makeRedis () {
	const redis = new Redis ({
		showFriendlyErrorStack: true
	})
	
	redis.on ('error', error => {
		console.error (error)
		process.exit (1)
	})
	return redis
}
