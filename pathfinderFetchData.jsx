const Pagination = ({ items, pageSize, onPageChange }) => {
  const { Button } = ReactBootstrap;
  if (items.length <= 1) return null;

  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num);
  const list = pages.map((page) => {
    return (
      <Button key={page} onClick={onPageChange} className="page-item myButton wide">
        {page}
      </Button>
    );
  });
  return (
    <nav>
      <ul className="pagination">{list}</ul>
    </nav>
  );
};
const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};
function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}
const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};



// App that gets data from Hacker News url
function App() {
  const { Button } = ReactBootstrap;
  const { Fragment, useState, useEffect, useReducer } = React;
  
  let inspectingAncestry = "";
  
  let muhAncestryArray = [ancestryFocus];
  let ancestryFocus = {
    data: {
      description: {
        value:""
      },
      hp:"",
      rarity: {
        value:""
      },
      slug:""
    },
    name:""
  };

  const [ancestryData, setAncestryData] = useState("");
  const setInspecting = (e) => {
    inspectingAncestry = Number(e.target.id)+1;
    console.log ("clicked to inspectAncestry: " + inspectingAncestry);

    //if not a number value
    if (!!(inspectingAncestry)) {
      document.getElementById('ancestryInspector').hidden = false;
      document.getElementById('ancestryList').hidden = true;

      //Show focused data
          
        setAncestryData(
          document.getElementById('ancestryFocusDisplayText').innerHTML=
          `<h1>${muhAncestryArray[inspectingAncestry].name}</h1><br/>
          HP: ${muhAncestryArray[inspectingAncestry].data.hp}<br/>
          Vision: ${muhAncestryArray[inspectingAncestry].data.vision}<br/>
          ${muhAncestryArray[inspectingAncestry].data.description.value}<br/>`
          ,
        );
      //document.getElementById('ancestryFocusDisplayText').innerHTML = ancestryData;
    } else {
      document.getElementById('ancestryInspector').hidden = true;
      document.getElementById('ancestryList').hidden = false;
    }
    
    
  }
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    {
      url: 'https://api.pathfinder2.fr/v1/pf2/ancestry',
      headers: { 
        'Authorization': 'da468b89-2bf8-4e2b-a939-79c6e6ef25ce'
      }
    }
    ,
    
    {
      results: [],
    }
  );
  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };

  //console.log(`data = ${data}`);

  let page = data.results;
  //console.log(`page 1 = ${page[1]}`);
  
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    //console.log(`currentPage: ${currentPage}`);
  }

  return (
    
    <Fragment>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (

        <ul className="list-group">
          
          <div
          id="ancestryInspector"
          hidden={true}>
            
            <Button id="string" className= "myButton wide" onClick={setInspecting}>
                Back
            </Button>
            <p id="ancestryFocusDisplayText">
             FART
            </p>
            <Button id="string2" className= "myButton wide" onClick={setInspecting}>
                Back
            </Button>
          </div>
          <div id="ancestryList" hidden={false}>
          {page.map((item, index) => (
            //console.log("the index is" + index),
            muhAncestryArray.push(item),
            <li
            key={index}
            className="list-group-item"
            >
              <Button id={index} className= "myButton wide" focus={item} onClick={setInspecting}>
                {item.name}
              </Button>
            </li>
          ))}
          </div>
        </ul>
      )}
      <Pagination
        className="pagination"
        items={data.results}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
          
    </Fragment>

  );

}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));

/*
const container = document.getElementById('root');
// Create a root.
const root = ReactDOM.createRoot(container);
// Initial render
root.render(<App/>); */