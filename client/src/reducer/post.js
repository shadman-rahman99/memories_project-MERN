// Initializing every action type for dispatch as a const variable rather
// than string because misspelling string will not always be specifically 
// mentioned in our console but even if we misspell variables it will be
//  accurately shown on console. 
import { FETCH_ALL,COMMENT, FETCH_POST, FETCH_BY_SEARCH, START_LOADING, END_LOADING, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionTypes'

export default (state={ isLoading: true, posts:[] },action )=>{
    switch(action.type){
        case START_LOADING:
            return{ ...state, isLoading: true }
        
        case END_LOADING: 
            return{ ...state, isLoading: false }
        
        case FETCH_ALL:
            // returning mapped object
            return {
                ...state,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            }

        case FETCH_BY_SEARCH:
            return { ...state, posts: action.payload }

        case FETCH_POST:
            return { ...state, post: action.payload }

        case CREATE:
            return  { ...state, posts: [...state.posts, action.payload] }
        
        case UPDATE:
        case LIKE:
        return { ...state, posts: state.posts.map((post)=>( 
            // action.payload contains all the info from the updated post.
            post._id === action.payload._id ? action.payload : post
        ))}

        case COMMENT:
        return {  
            ...state,
            // iterating through posts and updating the newly commented post 
            // using action.payload which contains the newly commented post. 
            posts: state.posts.map((post)=> {
                if( post._id === action.payload._id ) return action.payload
                return post
            })
        }

        case DELETE:
        return { ...state, posts: state.posts.filter((post)=> (
            post._id !== action.payload
        ))}
        default:
            return state
    }
} 