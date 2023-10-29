# Blog analytics and search tool using Express.js and Lodash.
This Repository contains two API for the following operations.
* A Middle ware that analyzes the data retrieved from a third-party blog API (provided via the given curl request) and provides insightful statistics to clients.
* API that filters the blogs based on the provided query string (case-insensitive).

## To run the express server the following steps have to be done sequentially,
1) Clone this Git repository using this command
   ```
   git clone https://github.com/myself-karthick/Subspace.git
   ```
2) Initialize node modules:
   ```
   npm install 
   ```
3) To server the Server:
   ```
   npm run dev
   ```

## The API Endpoints are as follows:
1) GET api/blog-stats (API : getBlogStats)
```
curl --request GET \
  --url http://localhost:3000/api/blog-stats \
```

2) GET api/blog-search (API :searchBlogs)
```
curl --request GET \
  --url http://localhost:3000//api/blog-search?query='privacy' \
```
## Responses (JSON Object):
1) GET api/blog-stats (API : getBlogStats)
   
   ```
   {
        "Total no. of blogs",
        "Longest title",
        "No. of blogs with 'privacy' in title",
        "List of Unique titles"
   }
   ```
2) GET api/blog-search (API :searchBlogs)</br>
   If "http://localhost:3000//api/blog-search?query=conda" is called then response will be
   ```
   [
    {
        "id": "aea0907f-1b6f-4f88-ae7a-ac2397bb5ef0",
        "image_url": "https://cdn.subspace.money/whatsub_blogs/slate(1).png",
        "title": "Conda Installation 🎃"
    }
   ]
   ```
## Additional Feature:
Implemented caching mechanism using Lodash's memoize function to store the analytics results and search results for a certain period. 
If the same requests are made within the caching period, return the cached results instead of re-fetching and re-analyzing the data.
