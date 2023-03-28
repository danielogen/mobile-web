## Content
- [How To Set Up Redis as a Cache for MySQL with PHP on Ubuntu](#how-to-set-up-redis-as-a-cache-for-mysql-with-php-on-ubuntu)
    - [Prerequisites](#prerequisites)
    - [Step 1 — Installing the Redis Library for PHP](#step-1--installing-the-redis-library-for-php)
    - [Step 2 — Setting Up a Test Database, Table, and Sample Data](#step-2--setting-up-a-test-database-table-and-sample-data)
    - [Step 3 — Designing a PHP Script for Fetching and Caching MySQL Data](#step-3--designing-a-php-script-for-fetching-and-caching-mysql-data)
    - [Step 4 — Testing the PHP Script](#step-4--testing-the-php-script)
    - [Conclusion](#conclusion)

# How To Set Up Redis as a Cache for MySQL with PHP on Ubuntu
[Redis (**Re**mote **Di**ctionary *S*erver)](https://redis.com/) is a fast open-source, in-memory database that you can use as a key-value store for a highly scalable and performance-oriented system. Some of Redis’ use cases include: `caching`, `high-speed transactions`, `real-time analytics`, `live notifications`, `machine learning`, `searching`, and `queue/job processing`. Since Redis is an in-memory key-value store, its performance makes it suitable for caching data in your application.

Caching is storing data temporarily in a high-speed storage layer (for example, in a computer RAM) to serve data faster when clients make the same future requests. This enhances the re-use of previously computed data instead of fetching it each time from the disk.

When you’re working with [PHP](https://www.php.net/) and [MySQL](https://www.mysql.com/), using Redis as a cache improves your application performance because Redis stores data in RAM, which is several times faster than a hard disk (HDD) or a solid-state drive (SSD). Caching also reduces database costs—that is, the number of round trips made to the back-end database—and avoids overloading the backend.

Caching data is an integral design feature when you are designing web applications with higher reads than writes. Such applications include blogs, online stores, and social media sites.

In this Lad, you will use Redis to cache MySQL data with PHP on Ubuntu syst
### Prerequisites
To complete this tutorial, you’ll need the following:
- Ubuntu server with a non-root user with sudo privileges.
- Install LAMP: Linux, Apache, MySQL, PHP (LAMP) stack on Ubuntu.
- A Redis Server set up

### Step 1 — Installing the Redis Library for PHP
To begin you’ll install the `php-redis` extension, which will allow you to use PHP to communicate with Redis. Run the following commands to update your server and install the extension:
```console
$ sudo apt update
$ sudo apt install php-redis
```
Confirm the installation and restart the Apache web server to load the extension:
```console
$ sudo systemctl restart apache2
```
Now that you have installed your dependencies, you’ll set up your database.
### Step 2 — Setting Up a Test Database, Table, and Sample Data
In this step, you’ll create a MySQL database to store data permanently to disk. You’ll also create some tables and a user account with full privileges to the database.

First, log in to your MySQL server as a `root` user:
```console
$ sudo mysql -u root -p
```
Enter the `root` password of your MySQL server that you set up in the LAMP prerequisite. Then, press `ENTER` to continue.

Next, create a `test_store` database with the following command:
```mysql
mysql> CREATE database test_store;
```
Make sure the action is successful by confirming the output:
```mysql
Output

Query OK, 1 row affected (0.00 sec)
```
Next, create a user for your database. We’ll call this user `test_user` in this tutorial. Replace `PASSWORD` with a strong password as well:
```mysql
mysql> CREATE USER 'test_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'PASSWORD';
```
Then grant `test_user` full privileges to the `test_store` database with:
```mysql
mysql> GRANT ALL PRIVILEGES ON test_store.* TO 'test_user'@'localhost';
```
Finally run the following command to reload the grant tables in MySQL:
```mysql
mysql> FLUSH PRIVILEGES;
```
Ensure you get the following output after each successful command:
```mysql
Output

Query OK, 0 rows affected (0.01 sec)
```
End the MySQL root session:
```mysql
mysql> quit;
```
You’ll receive the word `Bye` and the system will take you back to the server’s command line interface.

Log back in to the MySQL server with the credentials for the `test_user` that you just created:
```
$ mysql -u test_user -p
```
Enter the password for the `test_user` to proceed. Then, switch to the test_store database when you’re in the `mysql>` prompt:
```mysql
mysql> USE test_store;
```
Ensure you receive the following output:
```mysql
Output

Database changed.
```

Next, you’ll create a `products` table with three columns. You will use the `product_id` column to uniquely identify each product. To avoid assigning the IDs manually, you will use the `AUTO_INCREMENT` keyword. Then, you will use the `BIGINT` data type for the `product_id` column to support a large data set. The [BIGINT data type](https://dev.mysql.com/doc/refman/8.0/en/integer-types.html) can hold a minimum value of `-2^63` and a maximum value of `2^63-1`.

The `product_name` field will hold the actual names of your items. In this case, a [VARCHAR data type](https://dev.mysql.com/doc/refman/8.0/en/char.html) with a length of `50` characters will be enough. The last column in the products table is the price—you will use the `DOUBLE` data type to accommodate prices with decimals (for example, 16.33).

To create the products table, run the following command:
```mysql
mysql> CREATE table products
mysql> (
mysql> product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
mysql> product_name VARCHAR(50),
mysql> price DOUBLE
mysql> ) Engine = InnoDB;
```
You will receive the following output:
```mysql
Output

Query OK, 0 rows affected (0.01 sec)
```
Now you’ll populate the products table with some records for testing purposes.

You don’t need to enter data to the `product_id` column manually since the `AUTO_INCREMENT` column will complete this. Run the following commands one by one:
```mysql
INSERT INTO products(product_name, price) VALUES ('Virtual Private Servers', '5.00');
INSERT INTO products(product_name, price) VALUES ('Managed Databases', '15.00');
INSERT INTO products(product_name, price) VALUES ('Block Storage', '10.00');
INSERT INTO products(product_name, price) VALUES ('Managed Kubernetes', '60.00');
INSERT INTO products(product_name, price) VALUES ('Load Balancer', '10.00');
```
After running each command, ensure you get this output:

```mysql
Output

Query OK, 1 row affected (0.00 sec)
```
Verify the data using the `SELECT` command:
```
SELECT * FROM products;
```
You will receive output similar to the following:
```
Output
+------------+-------------------------+-------+
| product_id | product_name            | price |
+------------+-------------------------+-------+
|          1 | Virtual Private Servers |     5 |
|          2 | Managed Databases       |    15 |
|          3 | Block Storage           |    10 |
|          4 | Managed Kubernetes      |    60 |
|          5 | Load Balancer           |    10 |
+------------+-------------------------+-------+
5 rows in set (0.00 sec)
```
End the MySQL session for the test_user:

```mysql
mysql> quit;
```
Once you’ve set up the `test_store` database, `products` table, and `test_user`, you’ll code a `PHP` script to retrieve data from the` MySQL` database and cache it to `Redis`.
### Step 3 — Designing a PHP Script for Fetching and Caching MySQL Data
In this step, you’ll create a PHP script for retrieving the sample data that you’ve created in the previous step.

When you run the script for the first time, it will read the data from MySQL (that is, from disk) and then cache it to Redis. As a result subsequent reads of the products’ data will be from Redis (that is, from system RAM). System memory is multiple times faster than even the fastest solid-state drive, thus data will be retrieved faster from the Redis cache than reading from the system disk.

> _Note:_ 
> _While you might not get any performance boost, since you are retrieving just a few records from the MySQL database, several benchmarks prove that retrieving cached data from Redis is several times faster than reading it from MySQL when dealing with several hundred thousand records._

Create a `products.php` file in the root directory of your website:
```bash
$ sudo nano /var/www/html/products.php
```
To start, enter the following information to connect and create an instance of Redis and store it as an object in a `$redis` variable.

The address `127.0.0.1` connects to the localhost. You may change this value if you’re running `Redis` from a remote server. Remember to replace `REDIS_PASSWORD` with the specific password for `Redis` set in the `/etc/redis/redis.conf` configuration file.

Also, enter the appropriate port number. By default, `Redis` runs on port `6379`:
```php
<?php

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);
$redis->auth('REDIS_PASSWORD');
```
The next step is initializing a PHP variable you’ll use as a key in Redis.

As mentioned earlier in this guide, Redis acts as a key-value database and therefore you must have a unique key for the data that you intend to store and retrieve from it.

So, define a `PRODUCTS` key by adding the following information to the `/var/www/html/products.php` file. You are free to use any name in place of `PRODUCTS` key.

Your PHP script will use this key to cache information to Redis once data gets retrieved from the MySQL database:
```php
$key = 'PRODUCTS';
```
Next, include a conditional PHP `if...else` statement to check if the `PRODUCTS` key exists in `Redis`:
```php 
...
if (!$redis->get($key)) {
    $source = 'MySQL Server';
    $database_name     = 'test_store';
    $database_user     = 'test_user';
    $database_password = 'PASSWORD';
    $mysql_host        = 'localhost';

    $pdo = new PDO('mysql:host=' . $mysql_host . '; dbname=' . $database_name, $database_user, $database_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql  = "SELECT * FROM products";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
       $products[] = $row;
    }

    $redis->set($key, serialize($products));
    $redis->expire($key, 10);

} else {
     $source = 'Redis Server';
     $products = unserialize($redis->get($key));

}

echo $source . ': <br>';
print_r($products);
```
If the key doesn’t exist in Redis, the script connects to the database that you created earlier, queries the `products` table, and stores the data in Redis using the `$redis->set($key, serialize($products))` command.

The `$redis->expire($key, 10)`; command sets the expiration to 10 seconds. You may tweak this value depending on your cache policy.

The $source variable helps you to identify the source of the data once it is echoed as an array at the end of the script using the echo `$source` and `print_r($products)`commands.

Once you’ve put everything together, your `/var/www/html/products.php` file will be as follows:
```php
...
if (!$redis->get($key)) {
    $source = 'MySQL Server';
    $database_name     = 'test_store';
    $database_user     = 'test_user';
    $database_password = 'PASSWORD';
    $mysql_host        = 'localhost';

    $pdo = new PDO('mysql:host=' . $mysql_host . '; dbname=' . $database_name, $database_user, $database_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql  = "SELECT * FROM products";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
       $products[] = $row;
    }

    $redis->set($key, serialize($products));
    $redis->expire($key, 10);

} else {
     $source = 'Redis Server';
     $products = unserialize($redis->get($key));

}

echo $source . ': <br>';
print_r($products);
```
Save and close the file.

You’ve now set up a PHP script that will connect to MySQL and cache data to Redis. You’ll test your script in the next step.

### Step 4 — Testing the PHP Script

### Conclusion
In this guide, you’ve used Redis to cache MySQL data with PHP on Ubuntu 20.04. You may use the coding in this guide to set up a caching mechanism for your MySQL data, which is especially useful for high-traffic web applications.

