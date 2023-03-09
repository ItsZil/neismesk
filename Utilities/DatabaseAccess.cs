using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace neismesk.Utilities
{
    /// <summary>
    /// This class provides access to the MySQL database.
    /// </summary>
    public class DatabaseAccess
    {
        /*  Example usage:
        string connectionString = Environment.GetEnvironmentVariable("DATABASE_CONN_STRING");
        DatabaseAccess dataAccess = new DatabaseAccess(connectionString);

        // Load data
        List<Courier> couriers = await dataAccess.LoadData<Courier, dynamic>("SELECT * FROM Courier", null);

        // Save data
        Courier newCourier = new Courier { delivery_price = 9.99 }
        await dataAccess.SaveData("INSERT INTO Courier (delivery_price) VALUES (@delivery_price)", newCourier);
        */

        private readonly string _connectionString;

        public DatabaseAccess()
        {
            _connectionString = Environment.GetEnvironmentVariable("DATABASE_CONN_STRING");
        }

        public DatabaseAccess(string connectionString)
        {
            _connectionString = connectionString;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        /// <summary>
        /// Returns data as a List of objects.
        /// </summary>
        /// <typeparam name="T">The type of the objects to return</typeparam>
        /// <typeparam name="U">The type of the parameters used in the SQL query</typeparam>
        /// <param name="sql">The SQL query to be executed</param>
        /// <param name="parameters">The parameters used in the SQL query</param>
        /// <returns>List of objects of type T</returns>
        public async Task<List<T>> LoadData<T, U>(string sql, U parameters)
        {
            using MySqlConnection connection = GetConnection();
            using MySqlCommand command = new MySqlCommand(sql, connection);
            AddParameters(command, parameters);
            
            await connection.OpenAsync();
            using MySqlDataReader reader = (MySqlDataReader)await command.ExecuteReaderAsync();

            List<T> result = new List<T>();

            while (await reader.ReadAsync())
            {
                T row = Activator.CreateInstance<T>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    PropertyInfo property = row.GetType().GetProperty(reader.GetName(i));
                    if (property != null && !reader.IsDBNull(i))
                    {
                        property.SetValue(row, reader.GetValue(i), null);
                    }
                }
                result.Add(row);
            }
            return result;
        }

        /// <summary>
        /// Returns query results as a DataTable
        /// </summary>
        /// <param name="sql">The SQL query to be executed</param>
        /// <returns>DataTable containing the query results in plain form</returns>
        public async Task<DataTable> LoadData(string sql)
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                using (var command = new MySqlCommand(sql, connection))
                {
                    await connection.OpenAsync();
                    var dataTable = new DataTable();
                    using (var dataAdapter = new MySqlDataAdapter(command))
                    {
                        dataAdapter.Fill(dataTable);
                    }
                    return dataTable;
                }
            }
        }

        /// <summary>
        /// Executes a query that modifies data in the database.
        /// </summary>
        /// <typeparam name="U">Type of parameter object</typeparam>
        /// <param name="sql">SQL statement to execute</param>
        /// <param name="parameters">Object containing parameter values</param>
        public async Task<bool> SaveData<U>(string sql, U parameters)
        {
            try
            {
                using MySqlConnection connection = GetConnection();
                using MySqlCommand command = new MySqlCommand(sql, connection);
                AddParameters(command, parameters);

                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        /// <summary>
        /// Adds parameters to a database command object.
        /// </summary>
        /// <typeparam name="U">Type of parameter object</typeparam>
        /// <param name="command">Command object to add parameters to</param>
        /// <param name="parameters">Object containing parameter values</param>
        private void AddParameters<U>(IDbCommand command, U parameters)
        {
            if (parameters != null)
            {
                foreach (PropertyInfo property in parameters.GetType().GetProperties())
                {
                    IDbDataParameter parameter = command.CreateParameter();
                    parameter.ParameterName = property.Name;
                    parameter.Value = property.GetValue(parameters) ?? DBNull.Value;
                    command.Parameters.Add(parameter);
                }
            }
        }

        public bool TestConnection()
        {
            // Return true if the connection is successful
            using MySqlConnection connection = GetConnection();
            connection.Open();
            // Check if the connection was  oppened successfully
            if (connection.State == ConnectionState.Open)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
