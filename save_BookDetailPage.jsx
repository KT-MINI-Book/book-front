import { useEffect, useState } from "react";

import {

  BookDetail,

  BookCreate,

  BookDelete,

  BookUpdate,

} from "../api/bookApi";



function BookDetailPage({ mode, bookId, onGoList }) {

  const isCreate = mode === "create";



  const [title, setTitle] = useState("");

  const [author, setAuthor] = useState("");

  const [content, setContent] = useState("");

  const [apiKey, setApiKey] = useState("");

  const [quality, setQuality] = useState("medium");



  const [coverImage, setCoverImage] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  useEffect(() => {

    if (isCreate) return;



    const fetchBook = async () => {

      const book = await BookDetail(bookId);



      if (!book) return;



      setTitle(book.title);

      setAuthor(book.author);

      setContent(book.content);

      setCoverImage(book.coverImageUrl);

    };



    fetchBook();

  }, [isCreate, bookId]);



  const handleCreate = async () => {

    if (!title || !author || !content) {

      alert("제목, 작가, 내용을 모두 입력해주세요.");

      return;

    }



    if (!coverImage) {

      alert("AI 표지를 먼저 생성해주세요.");

      return;

    }



    await BookCreate({

      title,

      author,

      content,

      coverImageUrl: coverImage,

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),

    });



    alert("등록 완료");

    onGoList();

  };



  const handleUpdate = async () => {

    await BookUpdate(bookId, {

      title,

      author,

      content,

      coverImageUrl: coverImage,

      updatedAt: new Date().toISOString(),

    });



    alert("수정 완료");

    onGoList();

  };



  const handleDelete = async () => {

    const ok = window.confirm("정말 삭제하시겠습니까?");

    if (!ok) return;



    await BookDelete(bookId);



    alert("삭제 완료");

    onGoList();

  };



  const handleGenerateCover = async () => {

    if (!title || !content) {

      alert("도서 제목과 도서 내용을 입력해주세요.");

      return;

    }



    if (!apiKey) {

      alert("API Key를 입력해주세요.");

      return;

    }



    try {

      setLoading(true);

      setError("");

      setCoverImage("");



      const prompt = `

책 제목: ${title}



책 내용:

${content}



위 내용을 바탕으로 상업용 도서 표지 이미지를 생성해줘.

책 표지처럼 세련되고, 제목 분위기가 잘 드러나게 만들어줘.

`;



      const response = await fetch(

        "https://api.openai.com/v1/images/generations",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${apiKey}`,

          },

          body: JSON.stringify({

            model: "gpt-image-2",

            prompt,

            size: "1024x1536",

            quality,

          }),

        }

      );



      const data = await response.json();



      if (!response.ok) {

        throw new Error(data.error?.message || "이미지 생성 실패");

      }



      const imageBase64 = data.data[0].b64_json;

      const base64Image = `data:image/png;base64,${imageBase64}`;



      const uploadResponse = await fetch(

        "https://api.cloudinary.com/v1_1/dyi23dc8x/image/upload",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            file: base64Image,

            upload_preset: "cover_upload",

          }),

        }

      );



      const uploadData = await uploadResponse.json();



      if (!uploadResponse.ok) {

        throw new Error(uploadData.error?.message || "이미지 업로드 실패");

      }



      setCoverImage(uploadData.secure_url);

    } catch (err) {

      console.error(err);

      setError(err.message || "표지 생성 중 오류가 발생했습니다.");

    } finally {

      setLoading(false);

    }

  };



  return (

    <div>

      <header>

        <p>Logo</p>

        <nav>

          <button type="button" onClick={onGoList}>

            도서 목록

          </button>

          <span>{isCreate ? "도서 등록" : "도서 상세"}</span>

        </nav>

      </header>



      <main>

        <section>

          <h2>{isCreate ? "새로운 도서를 등록하세요" : "도서 상세"}</h2>



          {!isCreate && <p>bookId: {bookId}</p>}



          <label>

            도서 제목

            <input

              type="text"

              placeholder="제목"

              value={title}

              onChange={(e) => setTitle(e.target.value)}

            />

          </label>



          <label>

            작가

            <input

              type="text"

              placeholder="작가"

              value={author}

              onChange={(e) => setAuthor(e.target.value)}

            />

          </label>



          <label>

            도서 내용

            <textarea

              placeholder="내용"

              value={content}

              onChange={(e) => setContent(e.target.value)}

            />

          </label>



          {isCreate ? (

            <button type="button" onClick={handleCreate}>

              등록하기

            </button>

          ) : (

            <>

              <button type="button" onClick={handleDelete}>

                삭제

              </button>

              <button type="button" onClick={handleUpdate}>

                수정하기

              </button>

            </>

          )}

        </section>



        <section>

          <h3>AI 표지 생성 영역</h3>



          <label>

            API Key

            <input

              type="password"

              placeholder="OpenAI API Key"

              value={apiKey}

              onChange={(e) => setApiKey(e.target.value)}

            />

          </label>



          <label>

            품질 선택

            <select

              value={quality}

              onChange={(e) => setQuality(e.target.value)}

            >

              <option value="low">Low</option>

              <option value="medium">Medium</option>

              <option value="high">High</option>

            </select>

          </label>



          <button type="button" onClick={handleGenerateCover} disabled={loading}>

            {loading ? "생성 중..." : "생성"}

          </button>



          <p>이미지 미리보기</p>



          {coverImage && (

            <>

              <img

                src={coverImage}

                alt="AI 생성 도서 표지"

                style={{ width: "250px", borderRadius: "8px" }}

              />

              <p>{coverImage}</p>

            </>

          )}



          {loading && <p>표지를 생성합니다...</p>}

          {error && <p style={{ color: "red" }}>{error}</p>}

        </section>

      </main>

    </div>

  );

}



export default BookDetailPage;