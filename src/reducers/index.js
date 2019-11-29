// import Prismic from "prismic-javascript";
import siteData from "../siteData";
import React from 'react';
import myCache from "memory-cache";

const ReactIsInDevMode = () => { 
  return '_self' in React.createElement('div');
}

//
// Actions
//
export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";
export const UPDATE_ISSTARTED = "UPDATE_ISSTARTED";
export const UPDATE_IMAGECLICKEDIDX = "UPDATE_IMAGECLICKEDIDX";
export const UPDATE_PROJECTITEMS = "UPDATE_PROJECTITEMS";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const UPDATE_PAGE = "UPDATE_PAGE";
export const UPDATE_HIDEPROJECTS = "UPDATE_HIDEPROJECTS";

export const FETCH_REQUEST = "FETCH_REQUEST";
export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_GLOBAL_SUCCESS = "FETCH_GLOBAL_SUCCESS";
export const FETCH_FAILURE = "FETCH_FAILURE";

export const updateLanguage = lang => ({ type: UPDATE_LANGUAGE, lang: lang });
export const updateIsStarted = isStarted => ({ type: UPDATE_ISSTARTED, isStarted: isStarted });
export const updateImageClickedIdx = imageClickedIdx => ({ type: UPDATE_IMAGECLICKEDIDX, imageClickedIdx: imageClickedIdx });
export const updateProjectItems = projectItems => ({ type:UPDATE_PROJECTITEMS , projectItems: projectItems })
export const updateCategory = category => ({ type:UPDATE_CATEGORY , category: category })
export const updatePage = page => ({ type:UPDATE_PAGE , page: page })
export const updateHideProjects = isHideProjects => ({ type:UPDATE_HIDEPROJECTS , isHideProjects: isHideProjects })

export const fetchDataRequest = () => ({ type: FETCH_REQUEST });
export const fetchDataSuccess = (data) => ({ type: FETCH_SUCCESS, data: data});
// export const fetchGlobalDataSuccess = (data) => ({ type: FETCH_GLOBAL_SUCCESS, data: data});
export const fetchDataError = () => ({ type: FETCH_FAILURE });

const promise = (
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
          dispatch(fetchDataSuccess({})); // clear data
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

// export const fetchGlobalData = () => (dispatch, getState) => {
//   const state = getState();
//   let { lang } = state;

//   fetch('http://dev.ioiocreative.com/HKSTP/cms/api')
//     .then(response => response.json())
//     .then(data => {
//       const results = data.content[lang]['global'];
//       // const results = siteData[lang]['global'];
//       dispatch(fetchGlobalDataSuccess(results));
//     })
// }

export const fetchAllData = () => (dispatch, getState) => {
  const state = getState();
  const cache = myCache.get(`data`);
  let { lang } = state;

  if (!cache) console.log(`-------------------- Data No Cache`);
  else console.log(`-------------------- Data Cached`);

  const fetchData = resolve => {

    // start message
    dispatch(fetchDataRequest());

    const path = ReactIsInDevMode() ? '//dev.ioiocreative.com/HKSTP/cms/api' : '/HKSTP/cms/api';
    fetch(path,{ 
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const results = data;
      // const results = siteData;

      // save data to store
      dispatch(fetchDataSuccess(results));

      // put data to cache
      myCache.put(`data`, {
        data: results,
        lang: lang
      });
      console.log(`-------------------- Data has been Cached`);
      console.log(`-------------------- Client cache:`, myCache.keys());

      resolve(results);
    });

    // save data to server
    // fetch(`http://localhost:3000/${lang}/api?keyname=${pageName}Data`, {
    //   method: "POST",
    //   body: JSON.stringify(results),
    //   headers: { "Content-Type": "application/json" }
    // }).catch(function(error) {
    //   console.log("Error:", error.message);
    //   throw error;
    // });

    // console.log(pageName, siteData[lang][pageName]);
  };

  return promise(dispatch, fetchData, cache, lang);
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
  page: 'home',
  isHideProjects: false,

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

    case UPDATE_PAGE:
      return { ...state, page: action.page }
      
    case UPDATE_HIDEPROJECTS:
      return { ...state, isHideProjects: action.isHideProjects }

    // case FETCH_GLOBAL_SUCCESS:
    //   return { ...state, globalData: action.data }

    case FETCH_SUCCESS:
      return { ...state, data:action.data.content, langData:action.data.languages }
      // switch (action.pageName) {
        // case "home":
        //   return { ...state, homeData: action.data };
        // case "projects":
        //   return { ...state, projectsData: action.data };
        // case "about":
        //   return { ...state, aboutData: action.data };

      //   default:
      //     return state;
      // }

    default:
      return state;
  }
};

export default reducer;
