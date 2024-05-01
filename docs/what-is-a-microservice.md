# What is a Microservice?

## Monolithic Architecture

Lets have a look at monolithic architecture for a bit.

![Monolithic](images/01-intro/Screenshot%202024-05-01%20094158.png)

We have all the code needed to implement our app in a single codebase and we deploy that codebase as one unit.

![Monolithic Contains](images/01-intro/Screenshot%202024-05-01%20094519.png)

## Microservices Architecture

![A Single Microservice Contains](images/01-intro/Screenshot%202024-05-01%20094626.png)

Lets have a look at this in a detailed manner

![Microservices](images/01-intro/Screenshot%202024-05-01%20094733.png)

All the services are independant of each other

### Data in Microservices

Whats the big challenge with microservices?

- Data management between services

With microservices, we store and access data in a sort of strange way

- In a **Monolithic server** it's easier to deal with data since theres only one database. Think about adding new feature to monolithic application. Write the query and get necessary data for the feature to be implemented
- In a **Microservices architecture** if we're introducing a new service, we can't access other services DBs because it creates a dependecy between the services.

#### How we store data

- Each service gets it own database (if it needs one)
- Pattern known as : Databse-per-service
- We want each service to run independantly of other services
- If Service A accesses Service B's DB and if the service B's database crashes both service A & B will crash.
- Therefore giving each service its own DB dramatically increases the uptime of our system
- Database schema/structure might change unexpectedly
- Some services might function more efficiently with different types of DBs (SQL vs NoSQL)

#### How we access data

- Services will never ever reach into another services database.

### General Communication Strategies Between Services

- Sync
- Async (Dont think if JS terms)

#### Synchronous Communication

- Services communicate with each other using direct requests
- Conceptually easy to understand
- Service D wont need a DB
- Introduces dependency between services
- If any iner-service request fails, the overall request fails
- The entire request is only as fast as the slowest request. If one of these 3 request takes 20s to complete the request, the overall request is gonna take more than 20s to complete it
- Can easily introduce webs of requests

![Synchronous Communication](images/01-intro/Screenshot%202024-05-01%20102301.png)

#### Asynchronous Communication (Event Based Communication)

- Services communicate with each other using events

##### Method 1

![Method 1.1](images/01-intro/Screenshot%202024-05-01%20105144.png)

![Method 1.2](images/01-intro/Screenshot%202024-05-01%20105321.png)

- This is not very used in practice. Why?
- Has all the down ssides of sync comms + additional down sides
- Conceptually hard to understand
- Service D wont need a DB
- Introduces dependency between services
- If any iner-service request fails, the overall request fails
- The entire request is only as fast as the slowest request.
- Can easily introduce webs of requests

##### Method 2

- Just like the database-per-service pattern, async communication is going to seem bizarre and inefficient
- Think about introducing a new service; Service D

![Method 2.1 : Service D](images/01-intro/Screenshot%202024-05-01%20105848.png)

- In this way Service D would be 100% self contained

![Method 2.2](images/01-intro/Screenshot%202024-05-01%20110613.png)

Pros

- In this way Service D has zero dependencies on other services
- Servcie D will be extremely fast

Cons

- Data duplication. (Paying for extra storage but since these costs are very cheap on cloud platforms these days. Therefore it isnt a down side per se)
- Harder to understand

In Microservices, this form of communication is used.
