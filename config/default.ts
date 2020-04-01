export default {
	PORT: 4000,
	HOST: 'localhost',
	postgres: {
		url: 'localhost',
		port: 5432,
		database: 'graphql-boilerplate',
		password: 'postgres',
		username: 'postgres'
	},
	redis: {
		prefix: {
			session: 'session-default: '
		}
	},
	cookie: {
		name: 'session-cookie',
		maxAge: 1000 * 60 * 10,
		secure: false
	}
}
