# How To Set Up Redis as a Cache for MySQL with PHP on Ubuntu
[Redis (**Re**mote **Di**ctionary *S*erver)](https://redis.com/) is a fast open-source, in-memory database that you can use as a key-value store for a highly scalable and performance-oriented system. Some of Redis’ use cases include: `caching`, `high-speed transactions`, `real-time analytics`, `live notifications`, `machine learning`, `searching`, and `queue/job processing`. Since Redis is an in-memory key-value store, its performance makes it suitable for caching data in your application.

Caching is storing data temporarily in a high-speed storage layer (for example, in a computer RAM) to serve data faster when clients make the same future requests. This enhances the re-use of previously computed data instead of fetching it each time from the disk.

When you’re working with [PHP](https://www.php.net/) and [MySQL](https://www.mysql.com/), using Redis as a cache improves your application performance because Redis stores data in RAM, which is several times faster than a hard disk (HDD) or a solid-state drive (SSD). Caching also reduces database costs—that is, the number of round trips made to the back-end database—and avoids overloading the backend.

Caching data is an integral design feature when you are designing web applications with higher reads than writes. Such applications include blogs, online stores, and social media sites.

In this Lad, you will use Redis to cache MySQL data with PHP on Ubuntu system.