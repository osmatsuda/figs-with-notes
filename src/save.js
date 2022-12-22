import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const blockProps = useBlockProps.save();
    const blockKlsNameLead = 'wp-block-create-block-';
    const blockKlsName = blockProps.className.split(' ')
	  .filter((cn) => cn.startsWith(blockKlsNameLead))[0];
    const idPrefix = blockKlsName.slice(blockKlsNameLead.length) + '_' + attributes.iid;
    
    return (
	<figure {...blockProps}
		data-iid={attributes.iid}>
	    <Figs
		items={attributes.items}
		idPrefix={idPrefix}
	    />
	    <Notes
		items={attributes.items}
		idPrefix={idPrefix}
	    />
	</figure>
    );
}

function Figs({ items, idPrefix }) {
    let i = 1;
    return (
	<figure>{
	    items.map((item) => {
		const name = idPrefix + '_' + (i++);
		return (
		    <img
			id={name} alt="" title={item.caption} src={item.url}
			width={item.width} height={item.height}
		    />
		);
	    })
	}</figure>
    );
}

function Notes({ items, idPrefix }) {
    let i = 1;
    let notes_len = 0;
    const notes = items.map((item) => {
	const name = `#${idPrefix}_${i++}`;
	const caption = item.caption.trim();
	if (caption.length > 0)
	    notes_len++;
	return {name, caption};
    });
    if (notes_len > 0) {
	return (
	    <figcaption>{
		notes.map((item) => <a href={item.name} role="none">{item.caption}</a>)
	    }</figcaption>
	);
    }
    return <></>;
}
