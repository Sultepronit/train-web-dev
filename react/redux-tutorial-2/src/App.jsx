import { Route, Routes } from "react-router-dom"
import AddPostForm from "./features/posts/AddPostForm"
import PostsList from "./features/posts/PostsList"
import Layout from "./components/Layout"
import SinglePostPage from "./features/posts/SinglePostPage"

function App() {
  // return (
  //   <>
  //     <AddPostForm />
  //     <PostsList />
  //   </>
  // )
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
