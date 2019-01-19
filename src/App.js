import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Show>here</Show>

        </header>
      </div>
    );
  }
}

class Show extends Component {
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
            <div>
                {shows.map(item => (
                    <div key={item.name}>
                        {item.name}
                      <img className="img" data-sizes="auto" data-srcset={"https://image.tmdb.org/t/p/"+item.poster_path+" 1x, https://image.tmdb.org/t/p/w116_and_h174_face/"+item.poster_path+" 2x"} src={"https://image.tmdb.org/t/p/w58_and_h87_face/"+item.poster_path} alt={item.name}/>
                    </div>
                ))}
            </div>
        );
    }
  }
}

export default App;
