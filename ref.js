const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3000;

app.use(express.json());

const cacheDuration = 60000;
const memoizedHandler = (handler) => _.memoize(handler, undefined, cacheDuration);

const axiosConfig = {
    headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
    },
};

app.get('/api/blog-stats', memoizedHandler(async (req, res) => {
    try {
        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', axiosConfig);

        const blogs = response.data.blogs;
        const totalBlogs = blogs.length;
        const search_string = "privacy";
        const longestTitleBlog = _.maxBy(blogs, (blog) => blog.title.length);
        const privacyBlogs = _.filter(blogs, (blog) => (blog.title.toLowerCase()).includes(search_string));
        const uniqueTitles = _.uniqBy(blogs, 'title').map((blog) => blog.title);
        res.json({
            totalBlogs,
            longestTitle: longestTitleBlog.title,
            privacyBlogs: privacyBlogs.length,
            uniqueTitles,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));

app.get('/api/blog-search', memoizedHandler(async (req, res) => {
    const query = req.query.search_string.toLowerCase();

    if (!query) {
        return res.status(400).json({ error: 'Query parameter "query" is required.' });
    }

    try {
        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', axiosConfig);

        const blogs = response.data.blogs;
        const privacyBlogs = _.filter(blogs, (blog) => (blog.title.toLowerCase()).includes(query));

        res.json(privacyBlogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});