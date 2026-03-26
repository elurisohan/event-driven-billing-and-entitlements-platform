Hibernate Persistence Context

Hibernate does not immediately write changes to the database.

Instead it stores objects in memory called:

Persistence Context

Example:

User user = new User();
user.setName("Rohan");

entityManager.persist(user);

At this moment:

User object exists only in memory

Database is not yet updated.

Flush Operation

Flush means:

Synchronize memory state → database

Hibernate generates SQL for all changed entities.

Example:

INSERT INTO users ...
UPDATE projects ...
DELETE tasks ...
When Flush Happens

Hibernate flushes automatically:

1️⃣ Before transaction commit
2️⃣ Before certain queries
3️⃣ When you manually call:

entityManager.flush()
Your Log
146747200 nanoseconds spent executing 1 flush

Convert:

146,747,200 ns ≈ 146 ms

Meaning:

Hibernate took 146 ms to write changes to the DB.


Is High Flush Time Caused by Many JDBC Connections?

Short answer:

No.

Flush time is mostly affected by:

1️⃣ Database latency

Example:

App → DB network delay
2️⃣ Slow disk IO

Databases write to disk for durability.

3️⃣ Index updates

If tables have indexes:

INSERT must update indexes
4️⃣ Database load

If the DB is handling many queries.

5️⃣ Complex cascades

Hibernate might flush many related entities.

Example:

User
├ Projects
├ Tasks
└ Comments

One save could trigger many inserts.

4. JDBC Connections Do Affect Performance (But Differently)

Too many connections causes different problems:

Example

Database max connections:

Postgres default = 100

If your app opens too many:

ERROR: too many connections

Or heavy context switching.

Best practice:

Typical Spring Boot pool size:

10–30 connections

Example config:

spring.datasource.hikari.maximum-pool-size=20
5. In Your Case

Your metrics show:

1 JDBC connection used
5 SQL statements executed

So nothing unusual.

Queries were:

check username
check email
fetch plan
get sequence id
insert user
Senior Developer Insight

A senior dev reading this would say:

Registration flow is correct
DB queries look healthy
Transaction committed successfully
JWT returned