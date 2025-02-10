const bcrypt = require("bcrypt");
const User = require("../models/User");
const { api, getUsers } = require("./helpers/helpers");
const mongoose = require("mongoose");
const { server } = require("../index");

describe("Creating a new user", () => {
  
  beforeAll(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("pswd", 10);
    const user = new User({ username: "juadmin", passwordHash });

    await user.save();
  });

  test("Works as expected creating a fresh username", async () => {
    const userAtStart = await getUsers();

    const newUser = {
      username: "pepitotest",
      name: "Julian",
      password: "p1234",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const userAtEnd = await getUsers();

    expect(userAtEnd).toHaveLength(userAtStart.length + 1);

    const usernames = userAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("Creation fails with proper statuscode and message if username is alrady taken", async () => {
    const userAtStart = await getUsers();

    const newUser = {
      username: "pepitotest",
      name: "Julian Test",
      password: "test1234",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(409)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Expected `username` to be unique");

    const userAtEnd = await getUsers();
    expect(userAtEnd).toHaveLength(userAtStart.length);
  });

  test("Creation fails with appropriate status code and message if the username is already in use and is case sensitive", async () => {
    const userAtStart = await getUsers();

    const newUser = {
      username: "PePitoTest",
      name: "Julian Test",
      password: "test1234",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(409)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Expected `username` to be unique");

    const userAtEnd = await getUsers();
    expect(userAtEnd).toHaveLength(userAtStart.length);
  });

  test("Creation fails with appropriate status code and message if username attempts to create a user with blank spaces", async () => {
    const userAtStart = await getUsers();

    const newUser = {
      username: "PePito Test",
      name: "Julian Test",
      password: "test1234",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Username cannot contain spaces");

    const userAtEnd = await getUsers();
    expect(userAtEnd).toHaveLength(userAtStart.length);
  });

  //**TODO: Create and adapt test, for new users with email
  //**TODO: Create test, for update users with email and without email

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });  
});
