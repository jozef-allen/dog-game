import React from "react"

function Game() {

    const [dogData, setDogData] = React.useState({});
    const [result, setResult] = React.useState({ firstWord: "", breed: "", image: "https://images.dog.ceo/breeds/saluki/n02091831_11177.jpg" });
    const [answer, setAnswer] = React.useState("");
    const [verdict, setVerdict] = React.useState("");
    const [greyedToggle, setGreyedToggle] = React.useState(true);
    const [showAnswer, setShowAnswer] = React.useState(true);

    React.useEffect(() => {

        fetch("https://dog.ceo/api/breeds/list/all")
            .then(res => res.json())
            .then(data => setDogData(data))

    }, [])

    const fullBreedList = [];
    let firstBreedList;

    if (dogData.message) {
        firstBreedList = Object.keys(dogData.message);
    }

    function objectToArray() {
        if (dogData.message && firstBreedList) {
            // let count
            for (let i = 0; i < firstBreedList.length; i++) {
                const key = dogData.message[`${firstBreedList[i]}`]
                if (key.length > 0) {
                    for (let j = 0; j < key.length; j++) {
                        const combinedKeys = `${key[j]} ${firstBreedList[i]}`
                        fullBreedList.push(combinedKeys)
                    }
                } else {
                    fullBreedList.push(firstBreedList[i])
                }
            }
        }
    }

    function spaceCheck(value) {
        return value.indexOf(' ') >= 0;
    }

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function lowerCase(string) {
        return string.toLowerCase();
    }

    function findRandomBreed() {
        let breedToPlug;
        let firstWord;
        let breedToPlugC;
        let firstWordC;
        let url;

        // reset
        setVerdict("");
        setAnswer("");
        setGreyedToggle(false);
        setShowAnswer(false);

        // choose random breed
        const randomNumber = Math.floor(Math.random() * fullBreedList.length);
        const randomBreed = fullBreedList[randomNumber];
        // console.log(`randomBreed: ${randomBreed}`);

        // check if random breed has a space in its name
        // if so grab second word to plug into url
        // grab first word to use later
        if (spaceCheck(randomBreed) === true) {
            const values = randomBreed.split(" ");
            firstWord = values[0]
            breedToPlug = values[1];

        }

        // else use as is
        else {
            firstWord = "";
            breedToPlug = randomBreed;
            // console.log(`breedToPlug: ${breedToPlug}`);
        }

        //console.log(`breedToPlug: ${breedToPlug}`);
        //console.log(firstWord);

        // plug this into the directory
        if (firstWord) {
            url = `https://dog.ceo/api/breed/${breedToPlug}/${firstWord}/images`
        } else {
            url = `https://dog.ceo/api/breed/${breedToPlug}/images`
        }

        // console.log(`url: ${url}`);

        // fetch image data
        fetch(url)
            .then(res => {
                res.json()
                    .then(
                        function (data) {
                            // find length of message array and create random number
                            const imageList = Object.keys(data.message);
                            const randomNumberTwo = Math.floor(Math.random() * imageList.length)
                            // choose a random image from this array and add to state along with (capitalised) breed name
                            if (firstWord) {
                                firstWordC = capitaliseFirstLetter(firstWord)
                            }
                            breedToPlugC = capitaliseFirstLetter(breedToPlug);
                            setResult({ firstWord: firstWordC, breed: breedToPlugC, image: data.message[randomNumberTwo] })
                        }
                    )
            })
        return
    }

    function handleChange(event) {
        setAnswer(event.target.value);
    }

    function handleSubmit(event) {


        event.preventDefault();

        if (answer === "") {
            setVerdict("Please enter a guess")
        } else {

            let firstWordL
            const answerL = lowerCase(answer);
            if (result.firstWord) {
                firstWordL = lowerCase(result.firstWord);
            }
            const secondWordL = lowerCase(result.breed);

            if (result.firstWord) {
                if (answerL === firstWordL + ' ' + secondWordL) {
                    setVerdict("That's right!")
                } else {
                    setVerdict("No, try again...")
                }
            } else {
                if (answerL === secondWordL) {
                    setVerdict("That's right!")
                } else {
                    setVerdict("No, try again...")
                }
            }
        }

    }

    function revealAnswer() {
        setGreyedToggle(true);
        setShowAnswer(true);
    }

    objectToArray();

    return (
        <div>
            <div className="container">
                <img className="dog" src={result.image}></img>
            </div>

            <div className="buttons">

                <button className="button1" onClick={findRandomBreed}>Show random breed</button>
                <button className="button3" onClick={revealAnswer}>Reveal answer</button>

                <form>

                    {greyedToggle ? <input disabled="disabled" className="greyed-out" type="text"></input>
                        : <input className="standard"
                            type="text"
                            value={answer}
                            placeholder="Answer"
                            onChange={handleChange}>
                        </input>}

                    {showAnswer ? <p className="verdict">{(result.firstWord) && result.firstWord} {result.breed}</p> : <p className="verdict">{verdict}</p>}

                    <button className="button2" onClick={handleSubmit}>Submit</button>

                </form>


            </div>
        </div >
    );
}

export default Game;