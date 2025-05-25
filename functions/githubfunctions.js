import { Octokit } from "@octokit/core";
import fs from 'fs';



export async function deleterepo(reponame,ownername) {
  // console.log(process.env.GITHUB_ACCESS_KEY)
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

export async function createrepo(ownername,reponame,templaterepo,templateowner,repo_description) {
  const octokit=new Octokit({
    auth:process.env.GITHUB_ACCESS_KEY,
  })
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: templateowner,
      repo: templaterepo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    //console.log(response.data);
    if(response.data.is_template==false){
      return {message:"The repository is not a template repository, give a repository name that is a template."}
    }
    //creating new repo from template
    const resp = await octokit.request('POST /repos/{template_owner}/{template_repo}/generate', {
      template_owner: templateowner,
      template_repo: templaterepo,
      owner: ownername,
      name: reponame,
      description: repo_description,
      include_all_branches: false,
      'private': false,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if(resp.status==201){
      return {url:resp.data.html_url,message:"The repository has been successfully created from the template."}
    }
    else if(resp.status==404){
      return {message:"The template repository with given details is not found. incorrect username or repo name."}
    }
    else{
      return {message:"Some internal server error occured."}
    }
    
  } catch (error) {
    const errorMessage = `Error: ${error.message}\nStack: ${error.stack}\n`;
    fs.appendFileSync('error.log', errorMessage); // Log error to a file
    console.error('Error fetching issues:', error);
  }
}
