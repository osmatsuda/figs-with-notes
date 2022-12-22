import { useBlockProps } from '@wordpress/block-editor';
import { useState, useRef } from '@wordpress/element';
import { FormFileUpload, TextControl } from '@wordpress/components';

import { uploadMedia } from '@wordpress/media-utils';
import { useInstanceId } from '@wordpress/compose';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    function push(new_item) {
	setAttributes({items: [...attributes.items, new_item]});
    }
    const iid = useInstanceId(Edit);
    setAttributes({...attributes, 'iid': iid})
    return (
	<figure
	    {...blockProps}
	>
	    <Figs
		items={attributes.items}
		setAttributes={setAttributes}
	    />
	    <AddItem onadded={push} />
	</figure>
    );
};

function otherType(type) {
    if (type === 'width') return 'height';
    if (type === 'height') return 'width';
    throw new Error(`unknown type: ${type}`);
}
function Figs({ items, setAttributes }) {
    function sizeSetter(type, url, items) {
	return function(val, other) {
	    const new_items = [];
	    for (const itm of items) {
		if (itm.url === url) {
		    const new_itm = {};
		    for (const k in itm) {
			new_itm[k] = itm[k];
		    }
		    new_itm[type] = val;
		    if (other !== undefined) {
			new_itm[otherType(type)] = other;
		    }
		    new_items.push(new_itm);
		} else {
		    new_items.push(itm);
		}
	    }
	    setAttributes({items: new_items});
	};
    }
    function captionSetter(url, items) {
	return function(val) {
	    const new_items = [];
	    for (const itm of items) {
		if (itm.url === url) {
		    const new_itm = {};
		    for (const k in itm) {
			new_itm[k] = itm[k];
		    }
		    new_itm['caption'] = val;
		    new_items.push(new_itm);
		} else {
		    new_items.push(itm);
		}
	    }
	    setAttributes({items: new_items});
	};
    }
    const [whRatio, setWhRatio] = useState(1.0);
    const imgWrapRef = useRef(null);
    return (
	<>{
	    items.map((item) => {
		const setWidth = sizeSetter('width', item.url, items);
		const setHeight = sizeSetter('height', item.url, items);
		const setCaption = captionSetter(item.url, items);
		return (
		    <figure>
			<div
			    ref={imgWrapRef}
			    class={imageWrapperClassName(imgWrapRef.current, item.width, item.height)}>
			    <img
				width={item.width}
				height={item.height}
				src={item.url}
				onLoad={(e) => {
				    const self = e.target;
				    setWhRatio(self.naturalWidth / self.naturalHeight);
				    setWidth(self.naturalWidth, self.naturalHeight);
				}}
			    />
			</div>
			<SizeControl
			    dataRatio={whRatio}
			    width={item.width}
			    setWidth={setWidth}
			    height={item.height}
			    setHeight={setHeight}
			/>
			<figcaption>
			    <TextControl
				label="caption"
				value={item.caption}
				onChange={setCaption}
			    />
			</figcaption>
		    </figure>
		);
	    })
	}</>
    );
}

function imageWrapperClassName(wnode, w, h) {
    const wmax = (wnode && wnode.clientWidth) || 200;
    const hmax = (wnode && wnode.clientHeight) || 200;

    const names = ['img-wrapper'];
    if (w > wmax)
	names.push('overflow-right');
    if (h > hmax)
	names.push('overflow-bottom');
    return names.join(' ');
}

function SizeControl({ width, setWidth, height, setHeight, dataRatio }) {
    return (
	<div class="size-control">
	    <TextControl
		label="W"
		value={width == 0 ? '' : width}
		onChange={(val) => {
		    let _w = parseInt(val);
		    if (Number.isNaN(_w)) _w = 0;
		    const _h = Math.round(_w / dataRatio);
		    setWidth(_w, _h);
		}}
	    />
	    <TextControl
		label="H"
		value={height == 0 ? '' : height}
		onChange={(val) => {
		    let _h = parseInt(val);
		    if (Number.isNaN(_h)) _h = 0;
		    const _w = Math.round(_h * dataRatio);
		    setHeight(_h, _w)
		}}
	    />
	</div>
    );
}

function AddItem({ onadded }) {
    return (
	<FormFileUpload
	    accept="image/*"
	    onChange={(e) => {
		uploadMedia({
		    filesList: e.currentTarget.files,
		    onFileChange: ([ file ]) => {
			if (file !== undefined)
			    onadded({ url: file.url, });
		    },
		});
	    }}
	>＋</FormFileUpload>
    );
}
