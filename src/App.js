import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
        <div className="App">
            <header className="App-header">
                <Shows></Shows>
            </header>
        </div>
    );
  }
}

class Shows extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        shows: []
    };
  }

  componentDidMount() {
    fetch("https://api.themoviedb.org/3/discover/tv?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&include_null_first_air_dates=false")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    shows: result.results
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
  }

  render() {
    const { error, isLoaded, shows } = this.state;
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <Router>
                <div>
                    <Route path="/" exact render={()=> (
                        <div className="row">
                            {shows.map(item => (
                                <Link to={`/${item.id.toString()}`}>
                                    <div key={item.id.toString()} className="col-6 col-sm-4 col-md-3">
                                        <img className="img" data-sizes="auto" srcset={"https://image.tmdb.org/t/p/"+item.poster_path+" 1x, https://image.tmdb.org/t/p/w116_and_h174_face/"+item.poster_path+" 2x"} src={"https://image.tmdb.org/t/p/w58_and_h87_face/"+item.poster_path} alt={item.name}/>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}/>
                    <Route path="/:showId" component={Showpage}/>
                </div>
            </Router>

        );
    }
  }
}
//do a query to tv at
// const Showpage =({match}) => {
//     return (
//         <div>{match.params.showId}</div>
//     )
// }

class Showpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            info: null
        };
    }
    componentDidMount() {
        fetch(`https://api.themoviedb.org/3/tv/${this.props.match.params.showId}?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        info: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    render(){
        const { error, isLoaded, info } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if (info){
            return (
                <div>{info.homepage}</div>

            );
        }
        else {
            return (
                <div>no info is found.</div>
            );
        }
    }
}


export default App;
