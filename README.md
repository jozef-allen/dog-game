
# Dog Breed Guessing Game

## Goal

To create a fun game to put in my portfolio and show/improve my skills in React, JavaScript and fetching data from an API. 

## Live version

[Dog Breed Guessing Game](https://dog.ptesquad.com/) 

## Technologies Used

- React (18.2.0)
- JavaScript
- HTML
- CSS
- Node.js (v19.1.0)
- npm (8.19.3)

## Planning

### Concept

After browsing a few of the publicly available APIs I settled on [Dog API](https://dog.ceo/dog-api). It has a list of dog breeds and a wealthy database of dog photos, so I decided to use these two elements to create a game where the user is shown a photo of a random dog and has to guess the breed.

### Handling the data

1. Looking at the documentation I saw that the API had a list of breeds at [https://dog.ceo/api/breeds/list/all](https://dog.ceo/api/breeds/list/all) as JSON data. The main breeds were listed as keys within an object, and their sub-breeds - if they existed - were listed as arrays within the value. For example:
```
"bulldog": [
            "boston",
            "english",
            "french"
        ],
```
2. I also saw that the photos were listed in a different directory. For example, [https://dog.ceo/api/breed/bulldog/english/images](https://dog.ceo/api/breed/bulldog/images) held, within an object, all the available photos for the English Bulldog.

I decided to use the data from the first directory to create a new, one-dimensional array of breeds. For example, the three types of bulldog would be listed as three consecutive/separate breeds in my array. This would give me a total of 148 items, AKA 148 breeds. Then I would randomly select one of these breeds and use that string to grab a random photo from the second directory. 

If the user could guess the breed correctly while being shown the photo, they would 'win'.

## Code process

### Setting up

I created a simple list of three React components to be rendered in ```App.js```:
- Header
- Game
- Footer

This would be in-turn rendered in ```index.js``` with ```index.css``` styling the sole page.

### Game component

First I created some state called ```dogData``` and wrote some code to fetch the breed list from Dog API within ```.useEffect```, setting ```dogData``` to what was returned.

My app counts the number of breeds using ```Object.keys```, then uses this length to iterate over the breed list, checking each breed for sub-breeds. If the breed has none, it gets pushed to my new array (```fullBreedList```) as is. If it has sub-breeds the sub-breed value is taken as the first string and concatenated to the main breed, which becomes the second string. The resulting string is pushed to ```fullBreedList```. 

This concatenation creates names for breeds as we would speak them in conversation (e.g. 'English Bulldog'). However, there were one or two where the order was flipped (e.g. ```shepherd australian``` rather than 'Australian Shepherd'). This was simply down to the way the data was structured on Dog API and out of my control, but I wrote my code to make the flipped order the exception (2 out of 148).

### Main function

I then started on my ```findRandomBreed``` function which contains the majority of the logic in my app and is triggered by a button click, essentially starting the game. 

The first few lines of this function are resetting various pieces of state that get used later on. Next it grabs a random breed from the list of 148, then checks if the breed contains one or two words. If it contains one word (e.g. ```beagle```), the function plugs it into the URL string which accesses the photos (e.g. ```https://dog.ceo/api/breed/beagle/images```). If it contains two words the function plugs in the two words in reverse order (e.g. ```https://dog.ceo/api/breed/bulldog/english/images```).

Using this URL and ```fetch```, the function takes the directory's data and selects a random photo from it. At the top of the file there is some more state called ```result```, and this is an object that holds the main data that makes the game possible. It has three keys:
- ```breed``` (the main breed string)
- ```firstWord``` (the sub-breed string, if it exists)
- ```image``` (the photo/JPEG's URL, and this is set to a default value that shows the same first dog photo when the page initially renders)

So  ```findRandomBreed```'s last step is to set ```result```'s state, but just before it does it capitalises the first letter of the strings. There's a debate as to whether dog breed names are proper nouns; basically some are and some aren't but for consistency I decided to capitalise each word.

### Time to guess

Using the ```result``` state, my game displays the random dog photo on the page. Users now have a text ```input``` to make their guesses with. This ```input``` is a controlled component, in that what it displays is controlled by state (```answer```). There is a button to submit their guess, and when clicked this triggers the ```handleSubmit``` function.

First, this function checks if a string has been entered. If not it prompts the user with 'Please enter a guess'. There is a ```div``` below the ```input``` that is empty on first render, but it's used to display this message and all others to the user.

Next, this function makes the whole submitted answer lower case, then matches it against what's contained in ```result``` (which is also converted to lower case at this point). Depending on whether the answer is right or wrong, the user is presented with 'That's right!' or 'No, try again...'

### Revealing the answer

I also created a button for users to reveal the answer with if they can't guess correctly (to be honest, this game ended up being fairly difficult if you're not a dog lover). When the ```revealAnswer``` function is triggered, it alters a couple of pieces of boolean state that link up with the below instances of short circuit evaluation:

``` js
{greyedToggle ?
	<input disabled="disabled"
		className="greyed-out"
		type="text">
	</input> :
	<input className="standard"
		type="text"
		value={answer}
		placeholder="Answer"
		onChange={handleChange}>
	</input>}
 
{showAnswer ?
	<p className="verdict">
		{(result.firstWord) && result.firstWord} {result.breed}
	</p> :
	<p className="verdict">
		{verdict}
	</p>}
```
This means that correct answer is pulled and displayed from the ```result``` state, and at the same time, no more user input is possible as the ```input``` becomes disabled/greyed out.

### Styling

Once the functionality was all there I finished off the HTML for the header and footer components and styled the whole page to give it a bright/light-hearted feel. 

As the dimensions of the dog photos vary massively, I used the below CSS to render them all within the same square ```div```:
``` css
position: relative;

width: 380px;

height: 380px;

overflow: hidden;
```

## Wins & Challenges

### Wins

- I'm really glad I managed to come up with an original concept and work completely on my own to pull together what I've taught myself in React and JavaScript into something practical. I wanted to work on something that involved working with an API too -- it's nice to create something that will still function even as data is added to the API in the future. 
- I learnt a lot about how ```fetch``` works in practice and how ```.then``` and promises are different to ```async```/```await```.
- This was the first time I used Netlify to host a React app, and I linked it up with a custom URL on a domain I own -- it's now live for anyone to try.

### Challenges

- As mentioned previously, because of the way the breed names come through from the API, there are inconsistencies with the word order being correct or not (e.g. ```shepherd australian```). I sent the game to a friend who loved it but she was frustrated a couple of times when she wasn't 'right', even though she was.
- Also a couple of the breed names are listed on Dog API as a string with no spaces (e.g. ```germanshepherd```). I'm not quite sure why this is. Of course, if someone guesses with 'german shepherd' it won't be recognised as correct. Both of these points could be fixed in the code by creating exceptions, but ideally the initial data would be consistent.

## Future improvements?

If I wanted to dive deeper into this I could add to the game mechanic and create some kind of points system, or maybe a timed challenge for the user to beat.