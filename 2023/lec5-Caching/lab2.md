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
```
mysql> CREATE database test_store;
```
Make sure the action is successful by confirming the output:
```
Output

Query OK, 1 row affected (0.00 sec)
```
Next, create a user for your database. We’ll call this user `test_user` in this tutorial. Replace `PASSWORD` with a strong password as well:
```
mysql> CREATE USER 'test_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'PASSWORD';
```
Then grant `test_user` full privileges to the `test_store` database with:
```
mysql> GRANT ALL PRIVILEGES ON test_store.* TO 'test_user'@'localhost';
```
Finally run the following command to reload the grant tables in MySQL:
```
mysql> FLUSH PRIVILEGES;
```
Ensure you get the following output after each successful command:
```
Output

Query OK, 0 rows affected (0.01 sec)
```
End the MySQL root session:
```
mysql> quit;
```
You’ll receive the word `Bye` and the system will take you back to the server’s command line interface.

Log back in to the MySQL server with the credentials for the `test_user` that you just created:
```
$ mysql -u test_user -p
```
Enter the password for the `test_user` to proceed. Then, switch to the test_store database when you’re in the `mysql>` prompt:
```
mysql> USE test_store;
```
Ensure you receive the following output:
```
Output

Database changed.
```

Next, you’ll create a `products` table with three columns. You will use the `product_id` column to uniquely identify each product. To avoid assigning the IDs manually, you will use the `AUTO_INCREMENT` keyword. Then, you will use the `BIGINT` data type for the `product_id` column to support a large data set. The [BIGINT data type](https://dev.mysql.com/doc/refman/8.0/en/integer-types.html) can hold a minimum value of `-2^63` and a maximum value of `2^63-1`.

The `product_name` field will hold the actual names of your items. In this case, a [VARCHAR data type](https://dev.mysql.com/doc/refman/8.0/en/char.html) with a length of `50` characters will be enough. The last column in the products table is the price—you will use the `DOUBLE` data type to accommodate prices with decimals (for example, 16.33).

To create the products table, run the following command:
```
mysql> CREATE table products
mysql> (
mysql> product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
mysql> product_name VARCHAR(50),
mysql> price DOUBLE
mysql> ) Engine = InnoDB;
```

### Step 3 — Designing a PHP Script for Fetching and Caching MySQL Data

### Step 4 — Testing the PHP Script

### Conclusion
In this guide, you’ve used Redis to cache MySQL data with PHP on Ubuntu 20.04. You may use the coding in this guide to set up a caching mechanism for your MySQL data, which is especially useful for high-traffic web applications.

