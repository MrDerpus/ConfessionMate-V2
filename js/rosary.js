/**
 * Author: Matthew. Klatt
 * 
 * Version: v1.0.0
 * 
 * Description:
 * This is the javascript code for the virtual rosary.
 * 
 */






var bead   = 1; // Counts what bead you one.
var decade = 0; // Counts what Decade you're on.
var count  = 0; // Counts the total amount of prayers made.
var mary   = 1; // Used in the end_rosary() function.

var prayers = {
	1:['In the name.',  'In the name of the Father, and of the Son, <br> and of the Holy Spirit.'],
	2:['Nicene Creed.', 'I believe in God, the Father almighty, Creator of Heaven and earth. <br> And in Jesus Christ, His only Son, our Lord, <br> Who was conceived by the Holy Spirit, <br> born of the Virgin Mary, suffered under Pontius Pilate;  was crucified, died, and was buried. <br> He descended into Hell. The third day He rose again from the dead. <br> He ascended into Heaven, and sits at the right hand of God, the Father almighty. <br> He shall come again to judge the living and the dead. I believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.'],
	3:['Our Father.',   'Our Father who art in Heaven, hallowed be Thy name.  Thy Kingdom come, Thy will be done on Earth as it is in Heaven.  Please Lord, give us this day our daily bread and forgive us our trespasses as we forgive those who trespass against us.  And please Lord, lead us not into temptation but to salvation.  Amen.'],
	4:['Hail Mary.' ,   'Hail Mary full of grace, the Lord is with Thee.  Blessed art Thou among women & blessed is the fruit of Thy womb, Jesus Christ.  Holy Mary, mother of God, please pray for us sinners now & at the hour our deaths.  Amen. '],
	5:['Glory be.'  ,   'Glory be to the Father, and to the Son and to the Holy spirit as it was in the beginning, is now & ever shall be, world without end.  Amen.'],
	6:['O My Jesus.',   'O my Jesus, please forgive us our sins and save us from the fires of hell.  Please lead all souls into Heaven, especially those in most need of Thy mercy.  Amen.    [ANNOUNCE]'],
	7:['Hail Holy Queen.',   'Hail Holy Queen, mother of mercy; our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this vale of tears. Turn, then, most gracious advocate, thine eyes of mercy toward us. And after this, our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.'],
	8:['Concluding prayer.', 'O God, whose only-begotten Son by His life, death and resurrection, has purchased for us the rewards of eternal life; grant, we beseech Thee, that by meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.']
};

 var bead_imgs = {
	'red'    :  'media/imgs/rosary/bead-red.png', // Not yet completed prayer.
	'green'  :  'media/imgs/rosary/bead-green.png', // completed prayer.
	'yellow' :  'media/imgs/rosary/bead-yellow.png', // current prayer.

};

console.log(bead + ' <= Bead | Count => ' + count);


document.getElementById('rosary_button').addEventListener('click', bead_count);
document.getElementById('mary').addEventListener('click', end_rosary); // End Rosary.

// When user presses in the 'Our Lady' button, show the Hail Holy Queen Prayer & Concluding Prayer.
function end_rosary() {
	reset_beads();

	if(mary == 1){
		document.getElementById('mary').src = 'media/imgs/rosary/MotherMary-yellow.png';
		document.getElementById('prayer-title').innerHTML = prayers[7][0]; // Hail Holy Queen.
		document.getElementById('prayer').innerHTML = prayers[7][1]; 
	} else if(mary == 2){
		//mary = 0;
		document.getElementById('prayer-title').innerHTML = prayers[8][0]; // Concluding prayer Queen.
		document.getElementById('prayer').innerHTML = prayers[8][1]; 
	} else if(mary >= 3) {
		mary = 0;
		document.getElementById('mary').src = 'media/imgs/rosary/MotherMary-green.png';
		document.getElementById('prayer-title').innerHTML = 'Rosary complete!';
		document.getElementById('prayer').innerHTML = `You prayed ${decade}/5 decades of a rosary`;
	}

	mary++;
}


// Main Rosary bead counting/updating function.
function bead_count() {
	count++; // Increment count for each button press

	if (count == 1) {
		// Display the Sign of the Cross
		document.getElementById('cross').src = 'media/imgs/rosary/cross-yellow.png';
		document.getElementById('prayer-title').innerHTML = prayers[1][0]; // Sign of the Cross
		document.getElementById('prayer').innerHTML = prayers[1][1]; 
	} else if (count == 2) {
		// Display the Nicene Creed
		document.getElementById('prayer-title').innerHTML = prayers[2][0]; // Nicene Creed
		document.getElementById('prayer').innerHTML = prayers[2][1]; 
	} else if (count == 3) {
		// Start with the first bead (Our Father)
		// After the Nicene Creed, turn the cross green
		document.getElementById('cross').src = 'media/imgs/rosary/cross-green.png';
		document.getElementById('prayer-title').innerHTML = prayers[3][0]; // Our Father
		document.getElementById('prayer').innerHTML = prayers[3][1]; 
		update_bead(); // Turn the first bead yellow
		document.getElementById('decade').innerText = 'Decade: ' + decade;
	} else if (count >= 4 && count <= 13) {
		// Beads 2 to 11 are Hail Mary's
		document.getElementById('prayer-title').innerHTML = prayers[4][0]; // Hail Mary
		document.getElementById('prayer').innerHTML = prayers[4][1]; 
		update_bead(); // Update the bead color
	} else if (count == 14) {
		// After the 10th Hail Mary, we say Glory Be (no bead)
		document.getElementById('prayer-title').innerHTML = prayers[5][0]; // Glory Be
		document.getElementById('prayer').innerHTML = prayers[5][1]; 
		reset_beads(); // Turn all beads red
	} else if (count == 15) {
		// O My Jesus follows the Glory Be (no bead)
		document.getElementById('prayer-title').innerHTML = prayers[6][0]; // O My Jesus
		document.getElementById('prayer').innerHTML = prayers[6][1]; 
		// Increment decade 
		decade++;
	}

	// Bead and color handling only happens from bead 1 to 11
	if (count >= 3 && count <= 13) {
		var current_bead = document.getElementById('bead_' + bead);
		var previous_bead = document.getElementById('bead_' + (bead - 1));

		if (current_bead) {
			current_bead.src = bead_imgs['yellow']; // Current bead turns yellow
		}

		if (bead > 1 && previous_bead) {
			previous_bead.src = bead_imgs['green']; // Previous bead turns green
		}

		bead++; // Move to the next bead
	}

	// Reset after all prayers in the current decade
	if (count == 15) { // After O My Jesus, prepare for the next decade
		bead = 1; // Reset bead counter
		count = 2; // Set count to skip Sign of the Cross and Nicene Creed next time
	}

	console.log(bead + ' <= Bead | Count => ' + count);
}

// change the current beads colour.
function update_bead() {
	// Turn the current bead yellow
	var current_bead = document.getElementById('bead_' + bead);
	if (current_bead) {
		current_bead.src = bead_imgs['yellow'];
	}
}

// reset all beads to the colour red.
function reset_beads() {

	// Turn all beads red (called after the 10th Hail Mary)
	for (var i = 1; i <= 12; i++) {
		var beadElement = document.getElementById('bead_' + i);
		if (beadElement) {
			beadElement.src = bead_imgs['red'];
		}
	}
}