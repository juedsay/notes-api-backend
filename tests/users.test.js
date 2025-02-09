const bcrypt = require("bcrypt");
const User = require("../models/User");
const { api, getUsers } = require("./helpers/helpers");
const mongoose = require("mongoose");
const { server } = require("../index");

describe("Creating a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("pswd", 10);
    const user = new User({ username: "juadmin", passwordHash });

    await user.save();
  });

  test("works as expected creating a fresh username", async () => {
    const userAtStart = await getUsers();

    const newUser = {
      username: "juadmin",
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

  test("creation fails with proper statuscode and message if username is alrady taken", async () => {
    const userAtStart = await getUsers();

    const newUser = {
      username: "juadmin",
      name: "Julian Test",
      password: "test1234",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(409)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const userAtEnd = await getUsers();
    expect(userAtEnd).toHaveLength(userAtStart.length);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });
  
});
