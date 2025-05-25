import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { addtwonums } from "./functions/addtwonums.js";
import { deleterepo,createrepo } from "./functions/githubfunctions.js";
import dotenv from 'dotenv'
dotenv.config()
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
})


server.tool("Addtwonumbers", {
  a: z.number(),
  b: z.number()
}, async ({ a, b }) => {
  return { content: [{ type: 'text', text: JSON.stringify(await addtwonums(a, b)) }] }
})

// server.tool("GetGithubDetails",{
//   username:z.string()
// },async({username})=>{
//   return {content:[{type:'text',text:JSON.stringify(await getgithub(username))}]}
// })


server.tool('deleterepository',{
  repositoryname:z.string(),
  ownername:z.string()
},async({repositoryname,ownername})=>{
  return {content:[{type:'text',text:JSON.stringify(await deleterepo(repositoryname,ownername))}]}
})

server.tool('createrepository',{
  repositoryname:z.string(),
  ownername:z.string(),
  templaterepo:z.string(),
  templateowner:z.string(),
  repo_description:z.string()
},async({repositoryname,ownername,templaterepo,templateowner,repo_description})=>{
  return {content:[{type:'text',text:JSON.stringify(await createrepo(ownername,repositoryname,templaterepo,templateowner,repo_description))}]}
})


async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
init()




