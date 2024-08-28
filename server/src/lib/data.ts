type Post = {
    id: string;
    studentId: string;
    date: Date;
    timeSpent: number;
    notes: string;
};

let posts: Post[] = [];

// Handlers
export const getPosts = () => posts;

export const addPost = (post: Post) => {
    posts.push(post);
};

export const deletePost = (id: string) => {
    posts = posts.filter((post) => post.id !== id);
};

export const editPost = (id: string, timeSpent: number, notes: string) => {
    const post = posts.find((post) => post.id === id);
    if (post) {
        post.timeSpent = timeSpent;
        post.notes = notes;
    } else {
        throw new Error("NO POST FOUND");
    }
};

export const getById = (id: string) => {
    return posts.find((post) => post.id === id);
};
