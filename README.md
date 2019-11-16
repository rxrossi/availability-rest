# Availability REST API

An API to manage week availability of professionals and allow customers to book time slots

This API uses PostgreSQL 11.5 and Node.js 12.13.0.

## Setup

```bash
createdb availability-rest
npm install
npm run build
npm start
```

## Running tests

```bash
createdb availability-rest-test-db
npm install
npm test
```

It is also possible to run in watch mode with `npm run test:watch`

## Reading and updating availability of professionals

Availability is stored as an array of objects like the following:

```js
  {
    start: number,
    end: number
  }
```

Where `start` and `end` are the numbers of minutes from the start of the week, 0 represents 0 minutes of Sunday, 1440 represents 0 minutes of Monday

Bellow there is an example of payload for POST and GET methods with comments of the time that they represent

```js
;[
  {
    start: 1980, // Monday 9am
    end: 2160 // Monday 12pm
  },
  {
    start: 2220, // Monday 1pm
    end: 2460 // Monday 5pm
  },
  {
    start: 3420, // Tuesday 9am
    end: 3600 // Tuesday 12pm
  },
  {
    start: 3660, // Tuesday 1pm
    end: 3900 // Tuesday 5pm
  },
  {
    start: 4860, // Wednesday 9am
    end: 5040 // Wednesday 12pm
  },
  {
    start: 5100, // Wednesday 1pm
    end: 5340 // Wednesday 5pm
  }
]
```

Such format integrates nicely with `react-available-times`.

The available methods for this resource are GET and POST on /v1/professionals/:id/availability

## Getting all professionals available in a range of time

GET /v1/professionals?availableFrom=ISOdateString&availableTo=ISOdateString

## Booking a time slot

Customer can book one hour by passing the id of the professional and the starting time in ISO format.
As a business rule, Customer can only book exactly one hour

POST /v1/bookings

```js
{
  professionalId: number
  startTime: Date
}
```
