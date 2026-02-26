export const mysqlProvider = {
    provide: 'MYSQL_CONNECTION',
    useFactory: async () => {
        try {
            const connection = await require('mysql2/promise').createConnection({
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: '123456',
                database: 'gids6081-e'
            });
            
            console.log('✅ Database connection successful!');
            return connection;
        } catch (err) {
            console.error('Error connecting to database:', err);
            throw err;
        }
    }
};
