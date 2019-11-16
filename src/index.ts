import server from "./express"
import setupDatabase from "./setupDatabase"

const port = process.env.PORT || 3000

run()

async function run() {
  await setupDatabase()
  server.listen(port, () => console.log("Express server running at", port))
}
