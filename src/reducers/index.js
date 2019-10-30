// import Prismic from "prismic-javascript";
import siteData from "../siteData";
import myCache from "memory-cache";

//
// Actions
//
export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";
export const UPDATE_ISSTARTED = "UPDATE_ISSTARTED";
export const UPDATE_IMAGECLICKEDIDX = "UPDATE_IMAGECLICKEDIDX";
export const UPDATE_PROJECTITEMS = "UPDATE_PROJECTITEMS";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";

export const FETCH_REQUEST = "FETCH_REQUEST";
export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAILURE = "FETCH_FAILURE";

export const updateLanguage = lang => ({ type: UPDATE_LANGUAGE, lang: lang });
export const updateIsStarted = isStarted => ({ type: UPDATE_ISSTARTED, isStarted: isStarted });
export const updateImageClickedIdx = imageClickedIdx => ({ type: UPDATE_IMAGECLICKEDIDX, imageClickedIdx: imageClickedIdx });
export const updateProjectItems = projectItems => ({ type:UPDATE_PROJECTITEMS , projectItems: projectItems })
export const updateCategory = category => ({ type:UPDATE_CATEGORY , category: category })

export const fetchDataRequest = () => ({ type: FETCH_REQUEST });
export const fetchDataSuccess = (pageName, data) => ({ type: FETCH_SUCCESS, pageName: pageName, data: data});
export const fetchDataError = () => ({ type: FETCH_FAILURE });

const promise = (
  pageName,
  dispatch,
  fetchData,
  cache,
  lang,
  singlePostTitle = null
) => {
  return new Promise(resolve => {
    if (!cache) {
      fetchData(resolve);
    } else {
      if (cache.data) {
        if (cache.lang !== lang) {
          fetchData(resolve);
          console.log("-------------------- Different language, fetch again");
        } else if (
          singlePostTitle !== null &&
          cache.data.uid !== singlePostTitle
        ) {
          dispatch(fetchDataSuccess(pageName, {})); // clear data
          fetchData(resolve); // fetch again
          console.log(
            "-------------------- But different single post title, fetch again"
          );
        } else {
          // dispatch(fetchDataSuccess(pageName,cache.data));
          resolve(cache.data);
          console.log("-------------------- Used cache data");
        }
      }
    }
  }).catch(function(e) {
    console.log(e);
  });
};

export const fetchDataBy = pageName => (dispatch, getState) => {
  const state = getState();
  const cache = myCache.get(`${pageName}Data`);
  let { lang } = state;

  if (!cache) console.log(`-------------------- ${pageName}Data No Cache`);
  else console.log(`-------------------- ${pageName}Data Cached`);

  const fetchData = resolve => {
    const results = siteData[lang][pageName];

    // start message
    dispatch(fetchDataRequest());

    // save data to store
    dispatch(fetchDataSuccess(pageName, results));

    // put data to cache
    myCache.put(`${pageName}Data`, {
      data: results,
      lang: lang
    });
    console.log(`-------------------- ${pageName}Data has been Cached`);
    console.log(`-------------------- Client cache:`, myCache.keys());

    // save data to server
    fetch(`http://localhost:3000/${lang}/api?keyname=${pageName}Data`, {
      method: "POST",
      body: JSON.stringify(results),
      headers: { "Content-Type": "application/json" }
    }).catch(function(error) {
      console.log("Error:", error.message);
      throw error;
    });
    resolve(results);

    console.log(pageName, siteData[lang][pageName]);
  };

  return promise(pageName, dispatch, fetchData, cache, lang);
};

//
// Reducer
//
const initialState = {
  lang: "en",
  deviceType: "desktop",
  isMobile: false,
  isStarted: false,
  imageClickedIdx: null,
  category:'',

  homeData: null,
  projectsData: null,
  projectSingleData: null
};
const reducer = (state = initialState, action) => {
  console.log("                     !!!", action.type, "!!!");
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return { ...state, lang: action.lang };

    case UPDATE_ISSTARTED:
      return { ...state, isStarted: action.isStarted };
      
    case UPDATE_IMAGECLICKEDIDX:
      return { ...state, imageClickedIdx: action.imageClickedIdx };

    case UPDATE_PROJECTITEMS:
        return { ...state, projectItems: action.projectItems };
      
    case UPDATE_CATEGORY:
        return { ...state, category: action.category }

    case FETCH_SUCCESS:
      switch (action.pageName) {
        case "home":
          return { ...state, homeData: action.data };
        case "projects":
          return { ...state, projectsData: action.data };

        default:
          return state;
      }

    default:
      return state;
  }
};

export default reducer;
