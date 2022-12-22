document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.wp-block-create-block-figs-with-notes').forEach((block) => {
	const items = {};
	block.querySelectorAll('figcaption>a').forEach((note) => {
	    const name = note.getAttribute('href');
	    if (name && name.startsWith('#figs-with-notes_')) {
		items[name] = {
		    'fig': block.querySelector(name),
		    'note': note,
		};

		note.addEventListener('mouseenter', (e) => {
		    const target = items[e.currentTarget.getAttribute('href')].fig;
		    const klsname = target.className.split(' ')
			  .filter((cn) => cn.length > 0 && cn !== 'showup').join(' ');
		    target.className = klsname + ' showup';
		});
		note.addEventListener('mouseleave', (e) => {
		    const target = items[e.currentTarget.getAttribute('href')].fig;
		    target.className = target.className.split(' ')
			.filter((cn) => cn.length > 0 && cn !== 'showup').join(' ');
		});
		note.addEventListener('click', (e) => {
		    e.preventDefault();
		    console.log(e);
		});
	    }
	});
	Object.values(items).forEach((item) => {
	    item.fig.addEventListener('mouseenter', (e) => {
		const klsname = item.note.className.split(' ')
		      .filter((cn) => cn.length > 0 && cn !== 'showup').join(' ');
		item.note.className = klsname + ' showup';
	    });
	    item.fig.addEventListener('mouseleave', (e) => {
		item.note.className = item.note.className.split(' ')
		    .filter((cn) => cn.length > 0 && cn !== 'showup').join(' ');
	    });
	});
    });
}, { once: true });
