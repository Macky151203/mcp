import { Octokit } from "@octokit/core";



export async function deleterepo(reponame,ownername) {
  console.log(process.env.GITHUB_ACCESS_KEY)
  const octokit=new Octokit({
    auth:process.env.GITHUB_ACCESS_KEY,
  })
  const resp= await octokit.request('DELETE /repos/{owner}/{repo}', {
    owner: ownername,
    repo: reponame,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  console.log(resp.url)
  console.log(resp.status)
  if(resp.status==204){
    return {url:resp.url,message:"The repository with mentioned url has been successfully deleted"}
  }
  else if(resp.status==404){
    return {message:"The repsository with given details is not found. incorrect username or repo name."}
  }
  else{
    return {message:"Some internal server error occured."}
  }
}
