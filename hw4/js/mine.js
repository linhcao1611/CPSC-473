var questions = [
    {  value: 'Whats your (full) name?' },
	{ value:'Whats your Birthday?'},
	{ value:'What starsign does that make it?'},
    {  value: 'How old are you?' },
	{ value:'Whats your favourite colour?'},
	{value:'Whats your lucky number?'},
	{ value:'Do you have any pets?'},
	{ value:'Where are you from?'},
	{ value:'How tall are you?'},
	{ value:'What shoe size are you?'},
	{ value:'How many pairs of shoes do you own?'},
	{ value:'If you were prime miniser/ruler of the world what laws would you make?'}
];

$('#autocomplete').autocomplete({
    lookup: questions,
    onSelect: function (suggestion) {
        alert('You selected: ' + suggestion.value );
    }
});