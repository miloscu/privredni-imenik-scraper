import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

// Get characters

// Skip this part if you're comfortable using the below array

// [ '09', 'A', 'B', 'C', 'Č', 'Ć', 'D', 'Đ', 'DŽ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'LJ', 'M', 'N', 'NJ', 'O', 'P', 'Q', 'R', 'S', 'Š', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Ž']


const missing = [ 'DŽ', 'Š', 'J', 'LJ', 'M', 'N', 'NJ', 'P', 'Q', 'R', 'S', 'T' ]
const url = 'https://privredni-imenik.com/pretraga/abcd/';
const selector = '#page-content > div > div > div.col-sm-7.page-content.rezultati > div:nth-child(1) > ul';

let letters = [''];
const letterPageMap = {};

/** Get letters for JSON API search by letter */
async function getLettersFromHomepage() {
    try {
        const response = await fetch(url);
        const html = await response.text();

        const doc = new JSDOM(html).window.document;
        letters = [...doc.querySelectorAll(selector)]
            .map(e => e
                .textContent
                .trim()
                .split('\n')
                .map(f => f.trim())
                .filter(item => item.trim() !== ''))
            .flat();
    } catch (error) {
        console.log('Error:', error);
    }
};

async function getNumberOfPagesFromLetterPage(letter) {
    try {
        const response = await fetch(`${url}${letter}?page=1`);
        const html = await response.text();

        const doc = new JSDOM(html).window.document;

        console.log(letter + ': ' + doc.querySelector('#page-content .pagination:not(.abcd) > li:nth-last-child(2) > a')?.innerHTML);
        // letterPageMap[letter] = doc.querySelector('#page-content .pagination:not(.abcd) > li:nth-last-child(2) > a')?.innerHTML;
    } catch (error) {
        console.log('Error:', error);
    }
}

(async () => {
    await getLettersFromHomepage();

    const tasks = []

    letters.forEach(letter => {
        tasks.push(getNumberOfPagesFromLetterPage(letter));
    })
    await Promise.all(tasks);
    console.log(letterPageMap);
})();