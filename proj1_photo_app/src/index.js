import React from 'react';
import ReactDOM from 'react-dom'; //used to render React application
import './index.css';


/********************************************
-   UploadModule component: contains form to upload posts
-   the upload button toggles form visibility
-   the form contains URL/Caption inputs, and accept/cancel buttons
-   when accept is pressed, the form is hidden, and a post is added to the site
-   when cancel is pressed, the form is hidden, fields are cleared
-   both inputs must be filled when you press accept, or an err msg will show
 ********************************************/
class UploadModule extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            isVisible: false,
            err: "",        //store err msg if a form input field is empty
            post: {         //data structure to contain uploaded post information
                url: "",
                caption: "",
                id: ""
            }
        };
        this.toggleForm = this.toggleForm.bind(this);
        this.onFormChange = this.onFormChange.bind(this);
        this.handleAccept = this.handleAccept.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.isPostValid = this.isPostValid.bind(this);
    }
    //turns form visibility state on/off
    toggleForm(event) {
        event.preventDefault();
        let isVis = this.state.isVisible;
        this.setState({isVisible: !isVis});
    }
    //handler called when a field is changed in the form. updates state with form info
    onFormChange(event) {
        const { value, name } = event.target; //map the name of the changed form item to its value
        this.setState({
            ...this.state,
            post: {
                ...this.state.post, //use spread operator to update nested state
                [name]: value
            },
        });
    }
    //checks if both the url and caption fields are populated in the form
    isPostValid(){
        return (this.state.post.url !== "" && this.state.post.caption !== "");
    }
    //called when cancel is pressed. clears form and sets form visibility to false
    handleCancel(event) {
        event.preventDefault(); //prevent default form submission
        this.setState({
            isVisible: false,   //hide form
            err: "",
            post: {             //clear the form
                url: "",
                caption: "",
                id: ""
            }
        });
    }
    //called when accept is pressed. clears form and sets form visibility to false. 
    handleAccept(event) {
        event.preventDefault();     //prevent default form submission

        if (!this.isPostValid()){   //check if all fields are filled in the form
            this.setState({err: "please provide a url and caption!"});
            return;
        }

        let d = new Date();
        let post = this.state.post;
        post.id = d.getTime();
        this.props.addPost(post);    //push post to parent state

        this.setState({             //clear the form
            isVisible: false,       //hide form
            err: "",
            post: {             
                url: "",
                caption: "",
                id: ""
            }
        });
    }
    render() {

        let form; //will store form html structure or null
        let err; //contains error message or null
        if (this.state.err !== "") {
            err = (
                <div className="err-msg">
                    {this.state.err}
                </div>
            )
        }
        else {
            err = null;
        }
        if (this.state.isVisible) { //if form is visible, display html structure for url/caption inputs and accept/cancel buttons
            form = (
                <div className="form-container">
                    <form className="photo-form">
                        <div className="form-input url-input">
                            <label>
                                <input type="text" name="url" value={this.state.post.url} placeholder="Enter Photo URL..." onChange={this.onFormChange} />
                            </label>
                        </div>
                        <div className="form-input caption-input">
                            <label>
                                <input type="text" name="caption" value={this.state.post.caption} placeholder="Enter Caption..." onChange={this.onFormChange} />
                            </label>
                        </div> 
                        <div className="form-input form-btns-row">
                            <Button handleClick={this.handleAccept} classNames="form-btn accept-btn" label="Accept" />
                            <Button handleClick={this.handleCancel} classNames="form-btn cancel-btn" label="Cancel" />
                        </div>
                        {err}
                    </form>
                </div>
            )
        }
        else { //if form is not visible, do not display anything
            form = null;
        }

        return (
            <>  
                <div className="photo-module">
                    <Button handleClick={this.toggleForm} classNames="form-btn photo-dialogue-btn" label="Open Photo Entry Dialogue"/>
                    {form}
                </div>
            </>
        )
    }
}

class Post extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="post">
                <div className="post-img">
                    <img src={this.props.url} width="300" height="300" />
                </div>
                <div className="post-details-container">
                    <div className="post-details">
                        <h3>{this.props.caption}</h3>
                    </div>
                    <div className="post-details">
                        <Button handleClick={(event)=>{this.props.deletePost(event, this.props.id)}} classNames="btn exit-btn" label="X" />
                    </div>
                </div>
            </div>
        )
    }
}


/********************************************
-   Button component: component that just creates a button
-   Takes onClick function handler and button text as inputs
 ********************************************/
class Button extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <button
                className={this.props.classNames}
                onClick={this.props.handleClick}
            >{this.props.label}
            </button>
        );
    }
}


/********************************************
-   App component: parent component containing upload module
    and post list. 
-   contains all posts as an array
 ********************************************/
class App extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            posts: [] //keep track of all the current posts as an array
        };
        this.addPost = this.addPost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.renderPosts = this.renderPosts.bind(this);
    }
    //takes post data structure from form submission and adds it to total posts array
    addPost(post) {
        this.setState({ posts: [post, ...this.state.posts] }) //prepend the new post onto the array of posts in state
    }
    //when the X button is pressed for a post, removes the post from the array and re-renders
    deletePost(event, id) {
        event.preventDefault();
        const updatedPosts = this.state.posts.filter(post => post.id != id);
        this.setState({posts: updatedPosts});
    }
    //takes list of posts and turns them into individual post components
    renderPosts(posts) {
        let postsArr = posts.map((p) => <Post url={p.url} caption={p.caption} id={p.id} deletePost={this.deletePost}/>);
        return postsArr;
    }
    render() {
        let postsArr = this.renderPosts(this.state.posts);
        return (
            <div className="body">
                <div className="main-row">
                    <div className="pg-col left-col">
                        <UploadModule addPost={this.addPost} />
                    </div>
                    <div className="pg-col right-col">
                        <div className="posts-container">
                            {postsArr}
                        </div>
                    </div> 
                </div>
            </div>
            
        )
    }
}

//access div "root" container for React application 
const appRoot = document.getElementById("root");

//render the React element in the DOM
ReactDOM.render(
    <App />,
    appRoot, //element that exists in the DOM 
);