// Site content. DRAFT: written from widely published Galway history as a stand-in until the
// Phase 1 narratives and short reads are added. Every fact here should be checked against that research.
// Coordinates are approximate and need checking on the ground (overview step 3).

export const tribes = [
  { slug: 'athy', name: 'Athy', origin: 'Anglo-Norman', line: 'Among the earliest of the merchant families named in the town records.' },
  { slug: 'blake', name: 'Blake', origin: 'Anglo-Norman', line: 'Their tower house still stands where Quay Street meets the river.' },
  { slug: 'bodkin', name: 'Bodkin', origin: 'Anglo-Norman', line: 'A branch of the Fitzgeralds who took a new surname in Galway.' },
  { slug: 'browne', name: 'Browne', origin: 'Anglo-Norman', line: 'Their carved doorway of 1627 now stands in Eyre Square.' },
  { slug: 'darcy', name: "D'Arcy", origin: 'Gaelic Irish', line: 'One of two Gaelic families among the fourteen.' },
  { slug: 'deane', name: 'Deane', origin: 'Anglo-Norman', line: 'Merchants and mayors through the 1500s and 1600s.' },
  { slug: 'font', name: 'Font', origin: 'Anglo-Norman', line: 'The smallest of the tribes, gone from the city by the 1700s.' },
  { slug: 'french', name: 'French', origin: 'Anglo-Norman', line: 'Wine traders whose name came from their Norman roots.' },
  { slug: 'joyce', name: 'Joyce', origin: 'Anglo-Norman', line: 'Gave their name to Joyce Country, and a goldsmith to the Claddagh ring.' },
  { slug: 'kirwan', name: 'Kirwan', origin: 'Gaelic Irish', line: 'Remembered in Kirwan’s Lane, one of the oldest streets in the city.' },
  { slug: 'lynch', name: 'Lynch', origin: 'Anglo-Norman', line: 'Held the mayoralty 84 times between 1485 and 1654.' },
  { slug: 'martin', name: 'Martin', origin: 'Anglo-Norman', line: 'Later lords of Ballynahinch, and of “Humanity Dick” Martin.' },
  { slug: 'morris', name: 'Morris', origin: 'Anglo-Norman', line: 'Merchants who later held lands across County Galway.' },
  { slug: 'skerrett', name: 'Skerrett', origin: 'Anglo-Norman', line: 'Traders on the quays from the 1300s.' },
];

export const families = [
  { slug: 'oflaherty', name: 'O’Flaherty', line: 'The Gaelic lords of west Connacht whom the walled town feared most.', story: 'oflaherty-gate' },
  { slug: 'de-burgo', name: 'de Burgo (Burke)', line: 'The Anglo-Norman lords who founded the town and built the Red Earl’s hall.' },
];

export const stories = [
  { slug: 'lynch-window', title: 'The mayor who hanged his own son', verdict: 'legend', tribe: 'lynch',
    line: 'In 1493, the story goes, Mayor James Lynch FitzStephen hanged his son Walter from a window for murder.',
    photo: 'The Lynch Memorial Window, Market Street' },
  { slug: 'claddagh-ring', title: 'Richard Joyce and the Claddagh ring', verdict: 'mixed', tribe: 'joyce',
    line: 'A Joyce taken by corsairs, trained as a goldsmith, and home with the first Claddagh ring.',
    photo: 'A Claddagh ring on a jeweller’s bench' },
  { slug: 'tribes-name', title: 'How an insult became a name', verdict: 'fact', tribe: '',
    line: 'Cromwell’s soldiers called the families “the Tribes” to mock them. The families kept the name.',
    photo: 'The tribal flags over Eyre Square' },
  { slug: 'columbus', title: 'Columbus at St Nicholas’', verdict: 'legend', tribe: '',
    line: 'Did Christopher Columbus pray in Galway’s parish church in 1477? Many say so; few records agree.',
    photo: 'St Nicholas’ Collegiate Church from Lombard Street' },
  { slug: 'browne-doorway', title: 'The doorway that moved', verdict: 'fact', tribe: 'browne',
    line: 'The Browne family’s carved doorway of 1627 was moved to Eyre Square in 1905.',
    photo: 'The Browne Doorway, Eyre Square' },
  { slug: 'oflaherty-gate', title: '“From the ferocious O’Flahertys”', verdict: 'mixed', tribe: '',
    line: 'A prayer said to be carved over the west gate, asking God to keep the O’Flahertys out.',
    photo: 'The Spanish Arch and the old town wall' },
];

export const verdictLabel = { fact: 'Fact', legend: 'Legend', mixed: 'Fact and legend' };

// type: house (a family's house), gathering (a place the city met), story (where a tale is set)
export const places = [
  { id: 'lynch-castle', name: 'Lynch’s Castle', type: 'house', tribe: 'lynch', area: 'latin-quarter', lat: 53.27318, lng: -9.05287,
    line: 'The Lynch town house at Shop Street and Abbeygate Street, carved with the family arms.', href: 'tribes/lynch.html', linkText: 'The Lynch family' },
  { id: 'lynch-window', name: 'Lynch Memorial Window', type: 'story', tribe: 'lynch', area: 'latin-quarter', lat: 53.27285, lng: -9.05405,
    line: 'The window behind St Nicholas’ where the Lynch hanging is said to have happened.', href: 'stories/lynch-window.html', linkText: 'Read the story' },
  { id: 'st-nicholas', name: 'St Nicholas’ Collegiate Church', type: 'gathering', tribe: '', area: 'latin-quarter', lat: 53.27253, lng: -9.05357,
    line: 'The parish church of the tribes, founded in 1320, with their tombs and arms inside.', href: 'stories/columbus.html', linkText: 'Columbus at St Nicholas’' },
  { id: 'browne-doorway', name: 'Browne Doorway', type: 'house', tribe: 'browne', area: 'eyre-square', lat: 53.27447, lng: -9.04898,
    line: 'The doorway of the Browne house of 1627, rebuilt here in 1905.', href: 'stories/browne-doorway.html', linkText: 'The doorway that moved' },
  { id: 'eyre-square', name: 'Eyre Square', type: 'gathering', tribe: '', area: 'eyre-square', lat: 53.27410, lng: -9.04960,
    line: 'The old green outside the walls, where the fourteen tribal flags fly today.', href: 'stories/tribes-name.html', linkText: 'How the name stuck' },
  { id: 'kirwans-lane', name: 'Kirwan’s Lane', type: 'house', tribe: 'kirwan', area: 'latin-quarter', lat: 53.27165, lng: -9.05385,
    line: 'A medieval lane named for the Kirwan family, between Quay Street and Cross Street.', href: 'tribes/kirwan.html', linkText: 'The Kirwan family' },
  { id: 'blakes-castle', name: 'Blake’s Castle', type: 'house', tribe: 'blake', area: 'spanish-arch', lat: 53.27060, lng: -9.05350,
    line: 'A tower house of the Blake family at the foot of Quay Street.', href: 'tribes/blake.html', linkText: 'The Blake family' },
  { id: 'red-earl', name: 'Hall of the Red Earl', type: 'gathering', tribe: '', area: 'spanish-arch', lat: 53.27080, lng: -9.05385,
    line: 'The de Burgo hall where the town paid its taxes, before the tribes held power.', href: 'families.html', linkText: 'Other families' },
  { id: 'spanish-arch', name: 'Spanish Arch', type: 'gathering', tribe: '', area: 'spanish-arch', lat: 53.26994, lng: -9.05430,
    line: 'Part of the city wall of 1584, where ships from France and Spain unloaded wine.', href: 'stories/oflaherty-gate.html', linkText: '“From the ferocious O’Flahertys”' },
  { id: 'claddagh', name: 'The Claddagh', type: 'story', tribe: 'joyce', area: 'claddagh', lat: 53.26850, lng: -9.05800,
    line: 'The fishing village across the river, home of the ring Richard Joyce is said to have made.', href: 'stories/claddagh-ring.html', linkText: 'Read the story' },
];

export const areas = [
  { slug: 'latin-quarter', name: 'The Latin Quarter', line: 'Shop Street, Quay Street and the lanes between: the heart of the walled town.' },
  { slug: 'eyre-square', name: 'Eyre Square', line: 'The green outside the old walls, with the Browne Doorway and the tribal flags.' },
  { slug: 'spanish-arch', name: 'Spanish Arch and the quays', line: 'Where the wine ships came in, and the town wall met the river.' },
  { slug: 'claddagh', name: 'The Claddagh', line: 'The fishing village across the Corrib, with its own king and its own ring.' },
];
