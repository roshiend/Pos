# app/ views/ admin/ products/new.html.haml

- use_kindeditor

%h2#title New product
#action-links
  %ul
    %li.no-icon=link_to "返回", products_path
=render "shared/noscript"
=render "shared/upgrade_ie"
=form_for product, validate: true, html: { multipart: true } do |f|
  =message_block on: [product]
  %table(cellpadding="0" cellspacing="0" style="width: 100%;")
    %tbody
      %tr
        %td#product-details(colspan="2")
          .section-header New
          %dl.padding
            %dt.top
              =f.label :title
              %br/
              %span.note For example: the new generation iPhone4
            %dd=f.text_field :title,  style:"float:none;", id: :product_title, class: :big
            %dt.sst=f.label :body_html
          .container=f.text_area :body_html, id: :kindeditor
      %tr
        %td
          =f.fields_for :variants, child_index: '' do |v|
            .section-header.sst(style="margin-top:0") 属性
            .padding
              %dl
                %dt
              %p=f.label :product_type
              %span.note For example: clothing, computers, household appliances
              %dd
                %select#product-type-select
                  =options_for_select types_options
                =f.text_field :product_type, class: :hide
              %dt.sst
              %p=f.label :vendor
              %span.note Product manufacturer. Examples: IBM, TCL
              %dd
                %select#product-vendor-select
                  =options_for_select vendors_options
                =f.text_field :vendor, class: :hide
              %table.data2.sst.ssb
                %tbody
                  %tr
                    %th.clean=v.label :price
                    %th.clean=v.label :weight
                    %th.clean
                      =v.label :compare_at_price
                      %span.note Not required
                  %tr
                    %td
                      =v.text_field :price, style: 'width: 50px'
                      Yuan
                    %td
                      =v.text_field :weight, class: :requires_shipping_relate, style: 'width: 50px'
                      kg
                    %td
                      =v.text_field :compare_at_price, style: 'width: 50px'
                      Yuan
                  %tr
                    %td(colspan="3")
                      -#check_box contains hidden require_shipping, which will generate multiple variants
                      -#=v.check_box :requires_shipping, class: :requires_shipping, id: :variant_requires_shipping
                      =check_box_tag 'product[variants_attributes][][requires_shipping]', 1, product.variants.first.requires_shipping, id: :variant_requires_shipping, class: :requires_shipping
                      =v.label :requires_shipping, nil, for: :variant_requires_shipping
                      %span.hint Products of service nature or digital type do not need to be checked
              #options
                %h3 Product options
                The %p.note.sb option allows customers to distinguish between the various styles of the product.
                %input#enable-options{name:"create-options", type:"checkbox", checked:params['create-options']}
                %label(for="enable-options")
                  This product has
                  %strong multiple
                  Different styles.
                %p.note.ssb(style="padding-left: 20px") Example: size and color
                #create-options-frame.hide
                  %table#product-properties.data2(cellpadding="0" cellspacing="0")
                    %tbody
                      %tr
                        %th.clean(style="width: 180px;") Option name
                        %th.clean(style="width: 170px;") default value
                      %tr#add-option-bt
                        %td
                          %a.add-option(href="#") adds another option
                          %br/
                          %span.note For example: color, size
                        %td &nbsp;
            .section-header Inventory
            .padding
              %dl.ssb
                %dt
                  %label(for="variant_sku") SKU
                  %span.note (optional)
                  %br/
                  %span.note Unique identifier.
                %dd=v.text_field :sku
                %dd
                  %p=v.select :inventory_management, inventory_managements, {}, class: :inventory_management
                  %div
                    .inventory-option.st.inventory_management_relate.hide
                      %p.soft
                        =v.label :inventory_quantity
                        =v.text_field :inventory_quantity, class: [:small, :r, 'digit-2'], size: 6
                %dd.inventory_management_relate.hide
                  %p.soft
                    -inventory_policies.each do |policy|
                      =v.radio_button :inventory_policy, policy.code
                      %label.inline(for="product_variants_attributes__inventory_policy_#{policy.code}")=policy.name
                      %br/
          .section-header Tag
          .padding
            %dl(style="margin: 0;")
              %dd#multi-options
                %p.note tags are keywords used to help customers find the products they need. Keywords are separated by commas (,).
                =f.text_field :tags_text, size: 50
              %dd
                %p.note{:style => "clear: both"} Recently used tags, click to add.
                %ul#tag-list.tag-list.clearfix.nobull.st
                  -tags.each do |tag|
                    %that
                      %a(href="#")=tag.name
                .cl
          .section-header.sst collection
          .padding
            %dl(style="margin: 0;")
              %dd
                %p.note Select the custom collection to which this item belongs:
                %ul.nobull.pgroup.clearfix=render partial: "collection", collection: custom_collections
        / product images
        %td#product-right-col
          %h3.section-header(style="margin-bottom: 0") Product images
          #upload-area
            %h4.st Upload pictures
            %p.note Allowed upload file types (.gif, .jpg, .jpeg, .png)
            %p#file-input.st.sb
              =file_field_tag 'product[images][]', :class => 'multi nofixed'

  .group-actions
    =f.submit w('save'), id:"create-product-btn", class: :btn
    =w('or')
    =link_to w('cancel'), products_path
/ end div.main
/ end div.container
-#Product Options
%script(id="edit-option-item" type="text/x-handlebars-template")
  %td
    %select.option-selector=options_for_select options
    %input.hide(name="product[options_attributes][][name]" size="16" style="margin-top: 5px;" type="text" value="{{name}}")
  %td
    %input(name="product[options_attributes][][value]" size="16" type="text" value="{{value}}")
    {{#if destroyable}}
    %span.fr.sr(style="margin-top: 5px")
      %a.del-option(href="#")=image_tag 'admin/icons/trash.gif', alt: '删除'
    {{/if}}

:javascript
  App.init = function(){
    new App.Controllers.Products();
    Backbone.history.start();
  }
  App.product_options = new App.Collections.ProductOptions();
  App.product_options.refresh(#{product.options.to_json(methods: :value, except: [ :created_at, :updated_at ])});
  // Display product options
  new App.Views.ProductOption.Index({collection: App.product_options})

  task_name = 'add_product';

  #app/views/admin/products/show.html.haml
  -use_kindeditor

%h2#product_title= link_to product.title, "/products/#{product.handle}", title: 'View this page in the online store', target: '_blank'
#action-links
  %ul
    %li.no-icon
      %a.edit-btn(href="#") Modify
    %li.no-icon
      %a.dup-btn(href="#") Copy this product
    %li.no-icon
      = link_to image_tag('admin/icons/trash.gif'), product_path(product), method: :delete, title: 'Delete it', class: :del, data: { confirm: 'Are you sure you want to delete this product?' }

#duplicate-product.group.hide
  .group-fields
    %label.sb(for="duplicate_product_title" style="display:block;") Please enter the title of the new product
    %input#duplicate_product_title(name="product[title]" size="30" type="text")
  .group-actions
    %input#duplicate_product_submit.btn(name="commit" type="submit" value="复制商品")
      or
      %a.cancel(href="#") 取消

=form_for product, url: duplicate_product_path(product), method: :post, html: {id: 'new_product'} do |f|
  =hidden_field_tag 'new_product[title]'
.st
  #product-summary
    - if params[:new_product]
      #create-more-products.box2.message.sb
        %h3
          Any more merchandise?
          =link_to 'Add another product', new_product_path
    %table(cellpadding="0" cellspacing="0" style="width:100%")
      %tr
        %td#product-details
          #product

          #product-edit.hide
        %td#product-right-col(style="width: 275px; padding: 0 0 0 10px")
          %h3.section-header(style="margin-bottom: 0") Product images
          #product-image-area.group
            #image-show-area=render partial:'upload_photos',locals:{product:product}
            #upload-label.action-container
              .action-link.c(style="border-bottom: none")
                %span
                  %a.show-upload-link
                    %span.plus +
                    Upload pictures
            .clearfix
          #upload-area.hide
            %p#status.hide
              =image_tag 'admin/icons/trash.gif', alt: 'Delete'
              =image_tag 'spinner.gif',class: 'fr st pad', alt: 'Spinner'
            =form_for [product,photo], html: { multipart: true },remote: true do |p|
              %h4.st Upload pictures
              %p.note Allowed upload file types (.gif, .jpg, .jpeg, .png)
              %p#file-input.st.sb
                =p.file_field :product_image,id:"add-file",onchange: "$('#new_photo').submit();"
          .sst.pl
            %h3 Product visibility
            %p.sb.note
              If you do not want this product to be displayed in your store, you can set its visibility to
              %em Hide
              \.
            =form_for product, url: update_published_product_path(product), remote: true, html: {id: 'product_publicshed_form'} do |f|
              =f.select :published, publish_states, {}, style: "width: 120px; font-size: 13px", onchange: "$('#product_publicshed_form').submit();"
  #variant-inventory.pgroup
    %h3.sb Inventory
    %form#batch-form(action='#' onsumbit='return false')
      #variant-options.note(style="margin:10px 0")
      %table#product-controls.hide(cellpadding="0" cellspacing="0")
        %tr
          %td(style="text-align:left;")
            %select#product-select(name="operation")
            %span#new-value.hide
              %input(type="text" name="new_value" size="10" value="")
              %input(type="submit" value="保存")
              =w('or')
              %a.cancel(href="#")=w('cancel')
          %td(style="text-align:right; color: #333")
            %span#product-count.note &nbsp;
    %table#product-table.data(style="font-size: 12px;" cellpadding="0" cellspacing="0")
      %tr#row-head
    %ul#variants-list
    #new-variant-link.action-row
      .action-link
        %p
          %a(href="#")
            %span.plus +
            New styles
  #new-variant.hide

%script(id="show-product-item" type="text/x-handlebars-template")
  #product-body.textile.ssb
    %table.data.table-wrapper(cellpadding="0" cellspacing="0")
      %tr
        %th.section-header Description
      %tr
        %td(style="padding: 10px; font-size: 12px")
          %p {{{body_html}}}
  #product-options.section
    %table.data(cellpadding="0" cellspacing="0")
      %tbody
        %tr
          %th.section-header(colspan="2") 属性
        %tr
          %td.cell-title
            %strong Product Type:
          %td.middle.cell-data
            %span#product-type.small {{{product_type}}}
        %tr
          %td.cell-title
            %strong Product Manufacturer:
          %td.middle.cell-data
            %span#product-vendor.small {{{vendor}}}
        %tr
          %td.cell-title
            %strong Inventory:
          %td.middle.cell-data &infin;
      %tbody#product-options-list
  #tagging.section
    #product-tags
      %table.data(cellpadding="0" cellspacing="0")
        %tr
          %th.section-header tag
        %tr
          %td(style="padding: 15px 10px;")
            %ul.tag-list
              {{#each tags}}
              %that
                %span.list-box.active-tag {{this}}
              {{/each}}
            {{#unless tags}}
            %p You have not added any tags to this product.
            {{/unless}}
  .section
    #product-collections
      %table.data(cellpadding="0" cellspacing="0")
        %tr
          %th.section-header collection
        %tr
          %td(style="padding: 15px 10px 0 10px;")
            {{#if collections_empty}}
            %p This product does not belong to any collection.
            {{else}}
            %p This product belongs to the following collection:
            {{/if}}
            %ul.product-collection-list.pgroup
              {{#each collections}}
              %that
                %a(href="/admin/custom_collections/{{id}}") {{title}}
              {{/each}}

%script(id="edit-product-item" type="text/x-handlebars-template")
  =form_for product, class: :edit_product, html: {id: 'product-detail-form', onsubmit: 'return false;'} do |f|
    #product-body-edit.sb
      .section-header
        %strong Modify this product
      .padding
        #errors_for_product
        %dl(style="background: none; margin-bottom: 0")
          %dt=f.label :title, nil, style: "margin: 0", for: :title
          %dd=text_field_tag :title, '{{{title}}}', class: [:big, :sb]
          %dt#edit-handle-label
            Permalink
            %span.note
              (
              %a(href="#{wiki_url_with_port}/Handle" target="_blank") What is this?
              )
          %dd#edit-handle.ssb
            %span.note==#{shop.primary_domain.url}/products/
            =text_field_tag :handle, '{{{handle}}}', style: 'width: 160px'
          %dt=f.label :body_html
          %dd=text_area_tag :body_html, '{{body_html}}', id: 'kindeditor', style: "width: 895px; height: 200px;"
    #product-options-edit.section
      %table#product-properties.data.sb(cellpadding="0" cellspacing="0")
        %tr
          %th.section-header(colspan="2") 属性
        %tr
          %td.cell-title
            %strong Product Type:
          %td
            %select#product-type-select
              =options_for_select types_options
            #new_product_type.st.sb.hide
              %h4.note New product type
              =text_field_tag :product_type, '{{{product_type}}}'
        %tr
          %td.cell-title
            %strong Product Manufacturer:
          %td
            %select#product-vendor-select
              =options_for_select vendors_options
            #new_product_vendor.st.sb.hide
              %h4.note New product manufacturer:
              =text_field_tag :vendor, '{{{vendor}}}'
        %tr#add-option-bt.hide
          %td.cell-title
            %a.add-option(href="#") adds another option
            %br
            %span.note e.g. color, size
          %td &nbsp;
    #product-edit-tags
      .section-header Tag
      %dl.padding(style="background: none; margin: 0;")
        %dd#multi-options
          %p.note.sb Tags are separated by commas.
          =text_field_tag :tags_text, '{{{tags_text}}}', size: 50, id: :product_tags_text
        %dd.sst
          %p.note(style="clear: both") Recently used tags, click to add.
          %ul#tag-list.tag-list
            -tags.each do |tag|
              %that
                %a(href="#")=tag.name
          .cl
    #product-edit-collections
      .section-header collection
      %p.note(style="margin: 10px 0px 5px 5px;") Select the custom collection to which this product belongs:
      %ul.nobull.pgroup.clearfix=render partial: "collection", collection: custom_collections
    .group-actions
      =f.submit "保存", id:"update-options", class: :btn
      =w('or')
      %a.cancel(href="#")=w('cancel')
%script(id="row-head-item" type="text/x-handlebars-template")
  %th(class="checkbox-cell")
    %input#select-all(type="checkbox")
  {{#each_with_index options}}
  %th.option-title(id="option-header-{{index_plus}}" option-id="{{item.attributes.id}}" class="option-{{index_plus}}" style="width:15%;")
    {{#unless item.attributes.first}}
    %span.mover.hide(dir="-1" style="position: absolute; margin-left: -15px;")
      %a(href="#" style="color: #666; text-decoration:none" title="移到左边") ←
    {{/unless}}
    {{item.attributes.name}}
    {{#unless item.attributes.last}}
    %span.mover.hide(dir="1")
      %a(href="#" style="color: #666; text-decoration:none" title="移到右边") →
    {{/unless}}
  {{/each_with_index}}
  %th(style="min-width: 150px") SKU
  %th.price-cell(style="width: 90px;")
    price
    %span.note element
  %th.qty-cell(style="width:50px") Inventory quantity
  %th.action-cell(style="width: 70px;") &nbsp;
%script(id="show-variant-item" type="text/x-handlebars-template")
  =render partial: "admin/product_variants/show"
%script(id="new-variant-item" type="text/x-handlebars-template")
  =render partial: "admin/product_variants/new"
%script(id="variant-options-item" type="text/x-handlebars-template")
  choose:
  %a(href="#" style="color:#000") 所有
  %a(href="#" style="color:#000") 清空
  {{#each_with_index options}}
  %span(class='option-{{index_plus}}')
    {{#each_variant_option ../this index=index_plus}}
    %a(href="#") {{name}}
    {{/each_variant_option}}
  {{/each_with_index}}
%script(id="edit-option-item" type="text/x-handlebars-template")
  %td.cell-title
    .option-selector-frame
      %select.option-selector=options_for_select options
      %input.hide(name="product[options_attributes][][name]" size="16" style="margin-top: 5px;" type="text" value="{{{name}}}")
  %td
    %input(type="hidden" value="0" name="product[options_attributes][][_destroy]")
    %input(type="hidden" value="{{{id}}}" name="product[options_attributes][][id]")
    {{#unless id}}
    %input(type="text" name="product[options_attributes][][value]" size="16" value="{{{value}}}")
    {{/unless}}
    %span.option-value.small {{{variants_option0}}}
    %span.fr.sr(style="margin-top: 5px")
      %a.del-option(href="#" tabindex="-1")
        =image_tag 'admin/icons/trash.gif', alt: '删除', class: [:fr, 'delete-option-link']
      .option-deletemsg.hide
        %p.small.highlight-alt
          {{{name}}} will be deleted.
          %a.resume-option(href="#") 恢复
%script(id="show-option-item" type="text/x-handlebars-template")
  %td.cell-title(class="option-{{{position}}}")
    %strong {{{name}}}
  %td.option-values-show.middle.cell-data
    %span.small {{{options}}}
%script(id="product-select-item" type="text/x-handlebars-template")
  %option(value="" style="color: #888") 选择操作&hellip;
  %option.indent(value="price") Modify the price
  %option.indent(value="inventory_quantity") Modify inventory quantity
  %option.indent(disabled="disabled" value="destroy") 删除
  %optgroup(label="Copy style…")
    {{#each_with_index options}}
    %option(id="dup-option-{{index_plus}}" disabled="disabled" value="duplicate-{{index_plus}}") &hellip;使用另一个{{{item.attributes.name}}}
    {{/each_with_index}}
%script(id="product-image-item" type="text/x-handlebars-template")
  =dialog '{{{title}}}' do
    %img(src="{{{url}}}")

:javascript
  App.init = function(){
    new App.Controllers.Products();
    Backbone.history.start();
  }
  App.product = new App.Models.Product(#{product_json});
  App.product.url = "#{product_path(product)}";
  App.product_variants = new App.Collections.ProductVariants();
  App.product_variants.refresh(#{variants_json});
  App.current_sku_size = #{current_sku_size}
  App.shop_sku_size = #{shop_sku_size}
  new App.Views.Product.Show.Index({model: App.product})

  task_name = 'add_product';

# app/views/admin/products/_product.html.haml
%tr(class="product row#{cycle(:odd, :even)}")
  %td(style="padding-right: 5px; vertical-align: middle;")
    %input#checkbox-38663892.selector(name="products[]" type="checkbox" value="38663892")/
  %td.list-image(style="text-align: center ! important;")
    %label(for="checkbox-38663892")=image_tag 'other/no-image-thumb.gif'
  %td(style="padding-left: 3px; vertical-align: middle;")
    %p=link_to product.title, product_path(product), title: "处理:#{product.title}"
    %p.list-product-type=product.product_type
    %p.list-vendor=product.vendor
  %td.list-variants
    .expand-collapse-info.notification.hide
      %p(style="position: absolute; top: 11px")
        %a.expand(href="#")=image_tag 'admin/icons/arrow_right_small.png'
        %a.collapse.hide(href="#")=image_tag 'admin/icons/arrow_down_small.png'
    %ul#variant-list-38663892.variant-list.nobull.product-list-option-1
      -product.variants.each do |variant|
        %li.variant-list-item
          -product.options.each_with_index do |option, index|
            %p.note(style="font-size: 9px; line-height: 11px; margin: 0")=variant.attributes["option#{index+1}"]
          %span.large(style="font-size: 14px;line-height: 25px")=variant.inventory_quantity
          %br/
          .variant-tip.newtip.hide
            .default
              .content=variant.sku ? variant.sku : "No SKU"
  %td.list-total(style="text-align: center; vertical-align: middle;")
    %span(style="font-size: 18px")=product.variants.map(&:inventory_quantity).sum

# app/views/admin/product_variants/_new.html.haml
%form(action='#' onsubmit='return false')
  .section-header.sst New style
  %table.data.no-border(cellpadding="0" cellspacing="0" style="width: 650px")
    %tr
      %td(colspan="4")
        #errors_for_product_variant.hide
          #errorExplanation.errorExplanation
            %ul
        %p.sb
          %span.note.highlight-alt Your customers can choose this style through the following options:
          {{#each_with_index options}}
          .new-variant-option
            %label(for="product_variant_option{{index_plus}}" class="option-{{index_plus}}") {{item.attributes.name}}
            %br
            =text_field_tag "product_variant[option{{index_plus}}]", nil, style: "font-size:14px; width:100%", class: [:st, :ssb]
            -#%input(type="hidden" name="options[]" value="Title")
          {{/each_with_index}}
        .clearfix
    %tr.divider
      %td
        %label(for="variant_sku")
          SKU
          %span.note Stock keeping unit
        %br
        %input.st(name='product_variant[sku]' type='text' size=20)
      %td
        %label(for="variant_price") Sales price
        %br
        %input.st(name='product_variant[price]' value='{{price}}' type='text' size=8)
        Yuan
      %td
        %label(for="variant_compare_at_price")
          Market Price
          %span.note (optional)
        %br
        %input.st(name='product_variant[compare_at_price]' value='{{compare_at_price}}' type='text' size=8 style='width: 80px')
        Yuan
      %td
        %label(for="variant_weight") 重量
        %br
        %input.st.requires_shipping_relate(name='product_variant[weight]' value='{{weight}}' type='text' size=8 style='width: 40px')
        kg
    %tr.no-border
      %td(colspan="4")
        %table.secondary-variant-options
          %tr.no-border
            %td.secondary-header
              %label(for="product_variant_requires_shipping") requires a shipping address
            %td
              %input(name="product_variant[requires_shipping]" type="hidden" value="0")
              %input.requires_shipping(name='product_variant[requires_shipping]' type='checkbox' checked='checked' value="1")
              %span.hint Products of service nature or digital type do not need to be checked
          %tr.no-border
            %td.secondary-header
              %label(for="inventory-select-new") 库存
            %td
              %select.inventory_management(name='product_variant[inventory_management]' type='check_box')
                =options_for_select inventory_managements
              .inventory_management_relate.hide
                %div
                  .inventory-option.sst.inventory_management_relate.hide
                    %p.soft
                      %label(for="product_variant_inventory_quantity") Current inventory quantity?
                      %input#product_variant_inventory_quantity.small.r.digit-2(name="product_variant[inventory_quantity]" size="6" type="text")
                %p.soft(style="margin: 10px 0 0 0")
                  -inventory_policies.each do |policy|
                    %input(id="product_variant_inventory_policy_#{policy.code}" name="product_variant[inventory_policy]" type="radio" value="#{policy.code}")
                    %label.inline(for="product_variant_inventory_policy_#{policy.code}")=policy.name
                    %br/
  .group-actions
    %input.btn(name="commit" type="submit" value="保存")
    =w('or')
    %a.cancel(href="#")=w('cancel')
# app/views/admin/product_variants/_show.html.haml

%table.data(cellpadding="0" cellspacing="0")
  %tr.inventory-row.odd
    %td.checkbox-cell
      %input.selector(type="checkbox" id="variant-{{id}}-checkbox" value="{{id}}")
    {{#each_with_index options}}
    {{#option_value ../this}}
    %td(style="width:15%" class="option-{{index_plus}}")
      %label(for="variant-{{variant_id}}-checkbox") {{value}}
    {{/option_value}}
    {{/each_with_index}}
    %td(style="min-width: 150px")
    %td.price-cell(style="width: 90px;") {{price}}
    %td.qty-cell(style="width: 50px;") {{inventory_quantity}}
    %td.action-cell(style="width: 70px; text-align:right")
      %a.edit-btn.note(href="#") 修改
      =image_tag 'admin/icons/drag_handle.gif', class: :image_handle, style: 'float: right;'
  %tr.row-edit-details.hide
    %td(colspan="{{edit_td_size}}" style="padding: 0")
      %form(action="#" onsubmit='return false')
        %table.data.no-border(cellpadding="0" cellspacing="0")
          %tr(class="shadow {{#if is_single_variant}}single-variant-option-cell{{/if}}")
            %td(style="width: 29px; border: none; border-left: 1px solid #eee;background: #fcfcfc; padding: 0") &nbsp;
            {{#each_with_index options}}
            {{#option_value ../this}}
            %td.edit-option-cell(class="option-{{index_plus}}" style="width: 15%;padding-top: 10px !important")
              %label(for="variant_{{variant_id}}_option_{{index_plus}}") {{value}}
              %br
              %input(id="variant_{{variant_id}}_option_{{index_plus}}" name="product_variant[option{{index_plus}}]" size="30" style="margin-top: 5px;" type="text" value="{{value}}")
            {{/option_value}}
            {{/each_with_index}}
            %td.edit-option-cell(style="border-right: 1px solid #eee; width:20px") &nbsp;
            %td(style="min-width: 360px; padding: 0; border-bottom: 1px solid #eee" colspan="{{edit_td_size_except_options}}") &nbsp;
        .group.variant-edit
          %table.data.no-border(cellpadding="0" cellspacing="0")
            %tr.no-border
              %td.checkbox-cell &nbsp;
              %td
                %label(for="variant-{{id}}-sku") SKU
                %span.note Stock keeping unit
                %br
                %input.st(id="variant-{{id}}-sku" name="product_variant[sku]" size="30" style="width:120px" type="text" value="{{sku}}")
              %td
                %label(for="variant-{{id}}-price") Sales price
                %br
                %input.st(id="variant-{{id}}-price" name="product_variant[price]" size="8" style="width: 60px" type="text" value="{{price}}")
                &nbsp;元
              %td(style="width: 200px;")
                %label(for="variant-{{id}}-compare-at-price")
                  Market Price
                  %span.note (optional)
                %br
                %input.st(id="variant-{{id}}-compare-at-price" name="product_variant[compare_at_price]" size="8" style="width:80px" type="text" value="{{compare_at_price}}")
                元
              %td
                %label(for="variant-{{id}}-weight") 重量
                %br
                %input.st.requires_shipping_relate(id="variant-{{id}}-weight" name="product_variant[weight]" size="8" style="width:40px" type="text" value="{{weight}}")
                &nbsp; kg
            %tr.no-border
              %td &nbsp;
              %td(colspan="4")
                %table.secondary-variant-options
                  %tr.no-border
                    %td.secondary-header
                      %label(for="variant-{{id}}-requires-shipping") requires a shipping address
                    %td
                      %input(name="product_variant[requires_shipping]" type="hidden" value="0")
                      {{#if requires_shipping}}
                      %input.requires_shipping(id="variant-{{id}}-requires-shipping" checked="checked" name="product_variant[requires_shipping]" type="checkbox" value="1")
                      {{else}}
                      %input.requires_shipping(id="variant-{{id}}-requires-shipping" name="product_variant[requires_shipping]" type="checkbox" value="1")
                      {{/if}}
                      %span.hint Products of service nature or digital type do not need to be checked
                  %tr.no-border
                    %td.secondary-header
                      %label(for="inventory-select-{{id}}") 库存
                    %td
                      %select.inventory_management(id="inventory-select-{{id}}" name="product_variant[inventory_management]" value="{{inventory_management}}")
                        =options_for_select inventory_managements
                      %div.inventory_management_relate.hide
                        %div
                          .inventory-option.sst.inventory_management_relate.hide
                            %p.soft
                              %label(for="variant-inventory-quantity-{{id}}") Current inventory quantity?
                              %input.small.r.digit-2(id="variant-inventory-quantity-{{id}}" name="product_variant[inventory_quantity]" size="6" type="text" value="{{inventory_quantity}}")
                        %p.soft(style="margin: 10px 0 0 0")
                          -inventory_policies.each do |policy|
                            =radio_button_tag 'product_variant[inventory_policy]', policy.code, false, id: "variant-inventory-policy-#{policy.code}-{{id}}"
                            %label.inline(for="variant-inventory-policy-#{policy.code}-{{id}}")=policy.name
                            %br/
              %tr
                %td &nbsp;
                %td(colspan="4" style="padding-top: 12px")
                  %input.btn(type="submit" name="update" value="保存")
                  =w('or')
                  %a.cancel(href="#")=w('cancel')

# app/models/key_values.rb
# encoding: utf-8
module KeyValues

  class Base < ActiveHash::Base
    def self.options
      all.map {|t| [t.name, t.code]}
    end

    # {code1: name1, code2: name2}
    def self.hash
      Hash[*(all.map{|t| [t.code, t.name]}.flatten)]
    end

    def self.find_by_code(code)
      super(code.to_s)
    end
  end

  class CancelReason < KeyValues::Base
    self.data = [
      {id: 1, name: 'difficult to use' , code: 'difficulty_to_use' },
      {id: 2, name: 'Need other features', code: 'need_new_feature' },
      {id: 3, name: 'Help is not detailed', code: 'cant_find_help'},
      {id: 4, name: 'The cost is too expensive' , code: 'plan_are_expensive'},
      {id: 5, name: '其它'        , code: 'difficulty_to_use' },
    ]
  end

  class Resource < KeyValues::Base
    include ActiveHash::Associations
    belongs_to :resource_type , class_name: 'KeyValues::ResourceType'
    self.data = [
      {id: 1 , name: '首页'        , code: 'home'              ,resource_type_id: 1},
      {id: 2 , name: '顾客'        , code: 'customers'         ,resource_type_id: 1},
      {id: 3 , name: '订单'        , code: 'orders'            ,resource_type_id: 1},
      {id: 4 , name: '促销'        , code: 'marketing'         ,resource_type_id: 1},
      {id: 5 , name: 'Products & Collections' , code: 'products' , resource_type_id: 2},
      {id: 6 , name: '外观'        , code: 'themes'            ,resource_type_id: 2},
      {id: 7, name: 'Blog&Pages', code: 'pages', resource_type_id: 2},
      {id: 8 , name: 'Link List' , code: 'link_lists' , resource_type_id: 2},
      {id: 9 , name: '应用'        , code: 'applications'      ,resource_type_id: 3},
      {id: 10, name: 'Settings', code: 'preferences', resource_type_id: 3},
    ]
  end

  class ResourceType < KeyValues::Base
    include ActiveHash::Associations
    has_many :resources , class_name: 'KeyValues::Resource'
    self.data = [
      {id: 1, name: 'Store Management'},
      {id: 2, name: 'Store Contents'},
      {id: 3, name: 'Store Settings'},
    ]
  end

  #Payment Type
  class PaymentType < KeyValues::Base
    self.data = [
      {id: 1, name: 'Online Payment - Alipay', link: 'https://b.alipay.com/order/productSign.htm?action=newsign&productId=2011011904422299'},
      {id: 2, name: 'Online Payment-Tenpay', link: 'http://union.tenpay.com/mch/mch_register.shtml'},
      {id: 3, name: 'Online Payment-Quick Money' , link: 'http://www.99bill.com'}
    ]
  end

  #Comment status
  class CommentableType < KeyValues::Base
    self.data = [
      {id: 1, name: 'Disable comments' , code: 'no'},
      {id: 2, name: 'Comments allowed, subject to review', code: 'moderate'},
      {id: 3, name: 'Allow comments and automatically publish', code: 'yes'},
    ]
  end

  class PolicyType < KeyValues::Base
    self.data = [
      {id: 1, name: 'Refund Policy'},
      {id: 2, name: 'Privacy Policy'},
      {id: 3, name: 'Terms of Service'}
    ]
  end

  # Whether to publish
  class PublishState < KeyValues::Base
    self.data = [
      {id: 1, name: 'Public', code: 'true'},
      {id: 2, name: 'Hide', code: 'false'},
    ]
  end

  #Comment status
  class CommentState < KeyValues::Base
    self.data = [
      {id: 1, name: '垃圾的', code: 'spam'},
      {id: 2, name: 'Unreceived', code: 'unapproved'},
      {id: 3, name: 'public', code: 'published'},
    ]
  end


  # Number of entries per page
  class PageSize < KeyValues::Base
    self.data = [
      {id: 1, name: '25' , code: '25' },
      {id: 2, name: '50' , code: '50' } ,
      {id: 3, name: '100', code: '100'},
      {id: 4, name: '250', code: '250'},
    ]
  end

  module Shop

    class SignupSource < KeyValues::Base # Registration source
      self.data = [
        {id: 1, name: 'I'm not sure' , code: 'not_sure' },
        {id: 2, name: 'Other company introduction', code: 'from_company'},
        {id: 3, name: 'Friend introduction', code: 'from_frient'},
        {id: 4, name: 'blog' , code: 'blog' },
        {id: 5, name: 'search engine', code: 'search'},
        {id: 6, name: 'Web Advertising', code: 'web_ad'},
        {id: 7, name: 'Magazine Ad' , code: 'magazine_ad' },
        {id: 8, name: 'books' , code: 'book' },
        {id: 9, name: 'Other' , code: 'other' },
      ]
    end

    class Currency < KeyValues::Base # Currency
      self.data = [
        {id: 1, name: 'Renminbi (CNY)', code: 'CNY', html_unit: '¥{{amount}} yuan', html: '¥{{amount}}', email_unit: '¥{{amount}} yuan', email: '¥{{amount}}'},
        {id: 2, name: '美元 (USD)'  , code: 'USD', html_unit: '${{amount}} USD'     , html: '${{amount}}'      , email_unit: '${{amount}} USD', email: '${{amount}}' } ,
        {id: 3, name: '欧元 (EUR)'  , code: 'EUR', html_unit: '&euro;{{amount}} EUR', html: '&euro;{{amount}}' , email_unit: '€{{amount}} EUR', email: '€{{amount}}' } ,
        {id: 4, name: '港元 (HKD)'  , code: 'HKD', html_unit: 'HK${{amount}}'       , html: '${{amount}}'      , email_unit: 'HK${{amount}}'  , email: '${{amount}}' } ,
      ]
    end

  end

  module Theme

    class Role < KeyValues::Base # Publishing type
      self.data = [
        {id: 1, name: 'Normal', code: 'main' },
        {id: 2, name: '手机', code: 'mobile'},
      ]
    end

  end

  module Payment

    class Custom < KeyValues::Base
        self.data = [
          {id: 1 ,name: 'Bank transfer' , code: 'bank_transfer'},
          {id: 2 ,name: 'Post Office Remittance' , code: 'pos'},
          {id: 3 ,name: 'Cash on delivery' , code: 'cod'}
        ]
    end

    module Alipay

      class Service < KeyValues::Base # Payment interface
        self.data = [
          {id: 1, name: '即时到帐'  , code: ActiveMerchant::Billing::Integrations::Alipay::Helper::CREATE_DIRECT_PAY_BY_USER     },
          {id: 2, name: '担保交易'  , code: ActiveMerchant::Billing::Integrations::Alipay::Helper::CREATE_PARTNER_TRADE_BY_BUYER },
          {id: 3, name: 'Dual-function payment', code: ActiveMerchant::Billing::Integrations::Alipay::Helper::TRADE_CREATE_BY_BUYER }
        ]
      end

    end

    module Tenpay

      class Service < KeyValues::Base # Payment interface
        self.data = [
          {id: 1, name: 'Instant transaction', code: 'direct'},
          {id: 2, name: 'Medium price guaranteed transaction', code: 'protect'}
        ]
      end

    end

  end

  module Plan
    class Type < KeyValues::Base
      self.data = [
        {id: 1 ,name:'Ultimate Edition' , code: 'unlimited' , skus: 1000 , storage: 1000, price: 9988 },
        {id: 2 ,name:'Enterprise Edition' , code: 'business' , skus: 500 , storage: 500 , price: 5988 },
        {id: 3 ,name:'Professional Edition' , code: 'professional' , skus: 100 , storage: 100 , price: 2988 },
        {id: 4 ,name:'Free version' , code: 'free' , skus: 50 , storage: 50 , price: 0 }
      ]

      def free?
        self.code == 'free'
      end
    end
  end

  module Mail

    class Type < KeyValues::Base
        self.data = [
          {id: 10, name: 'Order confirmation reminder', code: 'order_confirm', des: 'When an order is created, send this email to the customer'},
          {id: 20, name: 'New order reminder', code: 'new_order_notify', des: 'When a new order is created, send this email to the store manager'},
          #{id: 25, name: 'New order reminder (mobile)', code: 'new_order_notify_mobile', des: 'When a new order is created, send this SMS to the online store manager'},
          {id: 26, name: 'Order payment confirmation reminder', code: 'order_paid', des: 'When the order is paid, send this email to the customer'},
          {id: 27, name: 'Order payment reminder', code: 'order_paid_notify', des: 'When the order is paid, send this email to the store manager'},
          {id: 30, name: 'Goods delivery reminder', code: 'ship_confirm', des: 'Send this email to the customer when the goods of the customer's order are shipped'},
          {id: 40, name: 'Goods delivery information change reminder', code: 'ship_update', des: 'When the delivery information of an order changes, send this email to the customer'},
          #{id: 50, name: 'Contact buyer', code: 'contact_buyer', des: 'The email content displayed when clicking "Send Email" on the order page'},
          {id: 60, name: 'Order Cancellation Reminder', code: 'order_cancelled', des: 'When an order is cancelled, send this email to the customer'},
          #{id: 70, name: 'Customer account activation reminder', code: 'customer_account_activation', des: 'When a customer creates an account, inform the customer how to activate the account and send this email to the customer'}, # Not needed yet
          #{id: 80, name: 'Customer account password change reminder', code: 'customer_password_reset', des: 'When a customer needs to change their password, send this email to the customer'},
          #{id: 90, name: 'Customer account confirmation reminder', code: 'customer_account_welcome', des: 'Send this email to the customer when the customer activates the account'}
        ]

        def title_body
          title = Rails.cache.fetch "shopqi_templates_emails_#{self.code}_title" do
            File.read(Rails.root.join("app/views/admin/templates/emails/#{self.code}_title.liquid"))
          end
          body = Rails.cache.fetch "shopqi_templates_emails_#{self.code}_body" do
            File.read(Rails.root.join("app/views/admin/templates/emails/#{self.code}_body.liquid"))
          end
          [title, body]
        end
    end
  end

  # Product related
  module Product

    module Inventory

      class Manage < KeyValues::Base
        self.data = [
          {id: 1, name: 'No need to track inventory' , code: '' },
          {id: 2, name: 'ShopQi is needed to track the inventory of this style', code: 'shopqi'}
        ]
      end

      class Policy < KeyValues::Base
        self.data = [
          {id: 1, name: 'Reject users from purchasing this product when stock is insufficient' , code: 'deny' },
          {id: 2, name: 'Allow users to purchase this item even if stock is low', code: 'continue'}
        ]
      end

    end

    # Product Style Options
    class Option < KeyValues::Base
      self.data = [
        {id: 1, name: 'Title', code: 'title' },
        {id: 2, name: 'Size', code: 'size' },
        {id: 3, name: 'color', code: 'color' },
        {id: 4, name: 'Material', code: 'material' },
        {id: 5, name: 'Style', code: 'style' }
      ]
    end

  end

  # customer
  module Customer

    class Boolean < KeyValues::Base
      self.data = [
        {id: 1, name: '是', code: true },
        {id: 2, name: '否', code: false},
      ]
    end

    class State < KeyValues::Base
      self.data = [
        {id: 1, name: 'Enabled', code: 'enabled' },
        {id: 2, name: 'disabled', code: 'disabled'},
        {id: 3, name: 'Invited', code: 'invited' },
        {id: 4, name: 'Rejected', code: 'declined'}, #The customer refused to register after sending the invitation email
      ]
    end

    # Filters
    class PrimaryFilter < KeyValues::Base
      self.data = [
        {id: 1, name: 'Consumption amount', code: 'total_spent', clazz: 'integer'},
        {id: 2, name: 'Number of orders' , code: 'orders_count' , clazz: 'integer'},
        {id: 3, name: 'Order time', code: 'last_order_date', clazz: 'date'},
        #{id: 4, name: 'City' , code: 'city' , clazz: 'city' },
        {id: 5, name: 'Receive marketing emails', code: 'accepts_marketing', clazz: 'boolean'},
        {id: 6, name: 'Abandoned order time', code: 'last_abandoned_order_date', clazz: 'date' },
        #{id: 7, name: 'Order tag', code: 'tag', clazz: 'tag'},
        {id: 8, name: 'Account Status' , code: 'status' , clazz: 'status' }
      ]
    end

    # Filter conditions
    module SecondaryFilter

      class Integer < KeyValues::Base
        self.data = [
          {id: 1, name: 'greater than', code: 'gt'},
          {id: 2, name: 'less than', code: 'lt'},
          {id: 3, name: 'equals', code: 'eq' }
        ]
      end

      class Date < KeyValues::Base
        self.data = [
          {id: 1, name: 'In the last week', code: 'last_week'},
          {id: 2, name: 'In the last month', code: 'last_month' },
          {id: 3, name: 'In the last three months', code: 'last_3_months'},
          {id: 4, name: 'In the last year', code: 'last_year'},
        ]
      end

    end

  end

  # Order
  module Order

    # state
    class Status < KeyValues::Base
      self.data = [
        {id: 1, name: 'Normal' , code: 'open' },
        {id: 2, name: 'Closed', code: 'closed' },
        {id: 3, name: 'Cancelled', code: 'cancelled'}
      ]
    end

    # Payment Status
    class FinancialStatus < KeyValues::Base
      self.data = [
        {id: 1, name: 'Paid', code: 'paid' },
        {id: 2, name: 'pending payment', code: 'pending' },
        {id: 3, name: 'Authentication', code: 'authorized'},
        {id: 4, name: 'abandoned' , code: 'abandoned' },
        {id: 5, name: 'Refunded', code: 'refunded' },
      ]
    end

    # Delivery Status
    class FulfillmentStatus < KeyValues::Base
      self.data = [
        {id: 1, name: 'Shipped', code: 'fulfilled'},
        {id: 2, name: 'Partial delivery', code: 'partial' },
        {id: 3, name: 'Unshipped', code: 'unshipped'}
      ]
    end

    class CancelReason < KeyValues::Base # Cancel reason
      self.data = [
        {id: 1, name: 'Customer Change/Cancel Order', code: 'customer' },
        {id: 2, name: 'Duplicate order', code: 'duplicate'},
        {id: 3, name: 'Not paid on time', code: 'not_pay'},
        {id: 4, name: 'Fraudulent order' , code: 'fraud' },
        {id: 5, name: 'No products', code: 'inventory'},
        {id: 6, name: 'Other' , code: 'other' }
      ]
    end

    class TrackingCompany < KeyValues::Base # Courier company
      self.data = [
        {id: 1, name: 'SF Express' , code: 'SF Express' , url: 'http://www.sf-express.com/cn/sc' },
        {id: 2,  name: 'EMS'      , code: 'EMS'      , url: 'http://www.ems.com.cn'           },
        {id: 3, name: 'STO E Logistics', code: 'STO E Logistics', url: 'http://www.sto.cn' },
        {id: 4, name: 'YTO Express', code: 'YTO Express', url: 'http://www.yto.net.cn'},
        {id: 5, name: 'Zhongtong Express' , code: 'Zhongtong Express' , url: 'http://www.zto.cn' },
        {id: 6, name: '宅速送' , code: '宅速送' , url: 'http://www.zjs.com.cn' },
        {id: 7, name: 'Yunda Express', code: 'Yunda Express', url: 'http://www.yundaex.com'},
        {id: 8, name: '天天快递' , code: '天天快递' , url: 'http://www.ttkdex.com' },
        {id: 9, name: 'FedEx' , code: 'FedEx' , url: 'http://www.fedex.com/cn' },
        {id: 10, name: 'Huitong Express', code: 'Huitong Express', url: 'http://www.htky365.com'},
        #{id: 11, name: 'Huaqiang Logistics' , code: 'Huaqiang Logistics' , url: '' },
        {id: 12, name: 'Other', code: 'Other', url: ''}
      ]

      def self.url(name) # Get the url address based on the company name
        self.find_by_name(name).try(:url)
      end
    end

  end

  module Link

    #Link Type
    class Type < KeyValues::Base
      self.data = [
        {id: 1, name: 'blog' , code: 'blog' },
        {id: 2, name: 'Store Homepage', code: 'frontpage' },
        {id: 3, name: 'Product collection', code: 'collection'},
        {id: 4, name: 'Specified page', code: 'page' },
        {id: 5, name: 'Specified product', code: 'product' },
        {id: 6, name: 'Query page', code: 'search' },
        {id: 7, name: 'Other URLs', code: 'http' }
      ]
    end

  end

  module Collection

    #Rule related columns
    class Column < KeyValues::Base
      self.data = [
        {id: 1, name: 'Product name', code: 'title', clazz: 'string'},
        {id: 2, name: 'Product type', code: 'product_type', clazz: 'string'},
        {id: 3, name: 'Product manufacturer', code: 'vendor', clazz: 'string'},
        {id: 4, name: 'Product price', code: 'variants_price', clazz: 'integer'},
        {id: 5, name: 'Compare prices', code: 'variants_compare_at_price' , clazz: 'integer' },
        {id: 6, name: 'Inventory', code: 'variants_inventory_quantity', clazz: 'integer' },
        {id: 7, name: 'variant name', code: 'variants_option1', clazz: 'string'}
      ]
    end

    #Rule Relationship
    class Relation < KeyValues::Base
      self.data = [
        {id: 1, name: 'equals' , code: 'equals' , clazz: 'all' },
        {id: 2, name: 'greater than', code: 'greater_than', clazz: 'integer'},
        {id: 3, name: 'less than' , code: 'less_than' , clazz: 'integer'},
        {id: 4, name: 'Starts with', code: 'starts_with', clazz: 'string'},
        {id: 5, name: 'Ends with', code: 'ends_with', clazz: 'string'},
        {id: 6, name: 'Includes' , code: 'contains' , clazz: 'string' },
      ]
    end

    #Sorting
    class Order < KeyValues::Base
      self.data = [
        {id: 1 , name: 'Sort by title pinyin in ascending order: AZ' , code: 'title.asc' },
        {id: 2 , name: 'Sort by title pinyin in descending order: ZA' , code: 'title.desc' },
        #{id: 3, name: 'Sort by sales volume', code: 'best-selling'},
        {id: 4 , name: 'By creation date: latest - oldest', code: 'created_at.desc'},
        {id: 5, name: 'By creation date: oldest - latest', code: 'created_at.asc'},
        {id: 6 , name: 'Sort by price: highest - lowest', code: 'price.desc' },
        {id: 7 , name: 'Sort by price: lowest-highest', code: 'price.asc' },
        {id: 8 , name: 'Manual sort' , code: 'manual' },
      ]

      # Manual sorting?
      def self.is_manual?(order)
        'manual' == order
      end
    end

  end

  module Webhook

    class Event < KeyValues::Base # 事件
      CARTS_CREATE           = 'carts/create'
      CARTS_UPDATE           = 'carts/update'
      COLLECTIONS_CREATE     = 'collections/create'
      COLLECTIONS_DELETE     = 'collections/delete'
      COLLECTIONS_UPDATE     = 'collections/update'
      CUSTOMER_GROUPS_CREATE = 'customer_groups/create'
      CUSTOMER_GROUPS_DELETE = 'customer_groups/delete'
      CUSTOMER_GROUPS_UPDATE = 'customer_groups/update'
      ORDERS_CREATE          = 'orders/create'
      ORDERS_UPDATE          = 'orders/update'
      ORDERS_PAID            = 'orders/paid'
      ORDERS_FULFILLED = 'orders/fulfilled' # The event will be triggered only after the order is fully shipped
      ORDERS_CANCELLED       = 'orders/cancelled'
      PRODUCTS_CREATE        = 'products/create'
      PRODUCTS_DELETE        = 'products/delete'
      PRODUCTS_UPDATE        = 'products/update'

      self.data = [
        #{id: 1, name: 'Create a shopping cart', code: CARTS_CREATE, scopes: [:read_carts, :write_carts]},
        #{id: 1, name: 'Update shopping cart' , code: CARTS_UPDATE , scopes: [:read_carts , :write_carts ]},
        #{id: 2, name: '新增集合'    , code: COLLECTIONS_CREATE    , scopes: [:read_products , :write_products ]},
        #{id: 2, name: '删除集合'    , code: COLLECTIONS_DELETE    , scopes: [:read_products , :write_products ]},
        #{id: 2, name: '修改集合'    , code: COLLECTIONS_UPDATE    , scopes: [:read_products , :write_products ]},
        #{id: 2, name: 'Add new customer groups', code: CUSTOMER_GROUPS_CREATE, scopes: [:read_customers, :write_customers]},
        #{id: 2, name: 'Delete customer groups', code: CUSTOMER_GROUPS_DELETE, scopes: [:read_customers, :write_customers]},
        #{id: 2, name: 'Modify customer groups', code: CUSTOMER_GROUPS_UPDATE, scopes: [:read_customers, :write_customers]},
        #{id: 2, name: '新增订单'    , code: ORDERS_CREATE         , scopes: [:read_orders   , :write_orders   ]},
        #{id: 2, name: '修改订单'    , code: ORDERS_UPDATE         , scopes: [:read_orders   , :write_orders   ]},
        #{id: 2, name: '订单支付'    , code: ORDERS_PAID           , scopes: [:read_orders   , :write_orders   ]},
        {id: 2, name: 'Orders shipped' , code: ORDERS_FULFILLED , scopes: [:read_orders , :write_orders ]}
        #{id: 2, name: '取消订单'    , code: ORDERS_CANCELLED      , scopes: [:read_orders   , :write_orders   ]},
        #{id: 2, name: '新增商品'    , code: PRODUCTS_CREATE       , scopes: [:read_products , :write_products ]},
        #{id: 2, name: '删除商品'    , code: PRODUCTS_DELETE       , scopes: [:read_products , :write_products ]},
        #{id: 2, name: '修改商品'    , code: PRODUCTS_UPDATE       , scopes: [:read_products , :write_products ]}
      ]
    end

  end

end

# app/models/product.rb
# encoding: utf-8
class Product < ActiveRecord::Base
  include Models::Handle
  belongs_to :shop
  has_many :photos                    , dependent: :destroy           , order: 'position asc'
  has_many :variants                  , dependent: :destroy           , class_name: 'ProductVariant'         , order: 'position asc'
  has_many :options                   , dependent: :destroy           , class_name: 'ProductOption'          , order: 'position asc'
  has_many :custom_collection_products, dependent: :destroy           , class_name: 'CustomCollectionProduct'
  has_many :custom_collections        , class_name: 'CustomCollection', through: :custom_collection_products , source: :custom_collection
  has_many :smart_collection_products , dependent: :destroy           , class_name: 'SmartCollectionProduct'
  has_and_belongs_to_many :tags       , order: 'id asc'
  # 标签
  attr_accessor :tags_text,:images
  attr_accessible :handle, :title, :published, :body_html, :price, :product_type, :vendor, :tags_text, :images, :photos_attributes, :variants_attributes, :options_attributes, :custom_collection_ids

  scope :published, where(published: true)

  accepts_nested_attributes_for :photos  , allow_destroy: true
  accepts_nested_attributes_for :variants, allow_destroy: true
  accepts_nested_attributes_for :options, allow_destroy: true

  validates_presence_of :title, :product_type, :vendor

  #商品列表中显示的产品图片
  def index_photo
    photo('thumb')
  end

  def photo(version = :icon)
    unless photos.empty?
      photos.first.send(version)
    else
      "/assets/admin/no-image-#{version}.gif"
    end
  end

  searchable do
    integer :shop_id, references: Shop
    text :title, :body_html, :product_type, :vendor
    text :variants_text do
      variants.map do |variant|
        [variant.option1, variant.option2, variant.option3, variant.sku]
      end
    end
  end

  before_create do
    if self.variants.empty?
      self.variants.build price: 0.0, weight: 0.0
    end
    if self.options.empty?
      option_name = KeyValues::Product::Option.first.name
      self.options.build name: option_name
      self.variants.first.option1 = "默认#{option_name}"
    end
  end

  before_save do
    self.make_valid(shop.products)
  end

  def tags_text
    @tags_text ||= tags.map(&:name).join(', ')
  end

  after_save do
    product_tags = self.tags.map(&:name)
    # 删除tag
    (product_tags - Tag.split(tags_text)).each do |tag_text|
      tag = shop.tags.where(name: tag_text,category: 1).first
      tags.delete(tag)
    end
    # 新增tag
    (Tag.split(tags_text) - product_tags).each do |tag_text|
      tag = shop.tags.where(name: tag_text, category: 1).first
      if tag
        # 更新时间，用于显示最近使用过的标签
        tag.touch
      else
        tag = shop.tags.create(name: tag_text, category: 1) unless tag
      end
      self.tags << tag
    end
  end

  def available
    self.published
  end

  def url
    "/products/#{self.handle}"
  end

  begin 'shop' # 只供商店调用

    def shop_as_json(options = nil) # 不能以as_json，会与后台管理的to_json冲突(options同名)
      {
        id: self.id,
        handle: self.handle,
        title: self.title,
        price: self.price,
        url: self.url,
        available: self.available,
        options: self.options.map(&:name),
        variants: self.variants.map(&:shop_as_json),
        featured_image: self.featured_image # 配合api.jquery.js的resizeImage方法
      }
    end

    def featured_image
      Hash[*Photo::VERSION_KEYS.map do |version|
        [version, self.photo(version)]
      end.flatten]
    end

  end

end

#商品款式
class ProductVariant < ActiveRecord::Base
  belongs_to :shop #冗余字段，前台商店下订单时使用
  belongs_to :product
  acts_as_list scope: :product
  validates_with SkuValidator
  attr_accessible :price, :weight, :compare_at_price, :option1, :option2, :option3, :sku, :requires_shipping, :inventory_quantity, :inventory_management, :inventory_policy, :position

  before_create do
    self.shop_id = self.product.shop_id
  end

  before_save do
    self.price ||= 0.0 # 价格、重量一定要有默认值
    self.weight ||= 0.0
  end

  after_save do
    min_price = self.product.variants.map(&:price).min || self.price
    self.product.update_attributes price: min_price # 商品冗余最小价格，方便集合排序
  end

  after_destroy do
    min_price = self.product.variants.map(&:price).min
    self.product.update_attributes price: min_price
  end

  def options
    [option1, option2, option3].compact
  end

  def title
    self.options.join(' / ') if product.variants.size > 1
  end

  def name
    (product.variants.size > 1) ? "#{product.title} - #{self.title}" : product.title
  end

  begin 'inventory' # 库存

    def inventory_policy_name
      KeyValues::Product::Inventory::Policy.find_by_code(inventory_policy).name
    end

    def manage_inventory? # 需要管理库存,下单时减一，销单时加一
      !self.inventory_management.blank?
    end

    def policy_deny? # 库存不足时拒绝继续销售
      self.inventory_policy == 'deny'
    end

    def low_in_stock? # 库存不足
      stock = self.inventory_quantity || 0
      stock <= 0
    end

    def available
      !(manage_inventory? and policy_deny? and low_in_stock?)
    end

  end


  begin 'shop' # 只供商店调用的json

    def shop_as_json(options = nil)
      {
        id: self.id,
        product_id: self.product_id,
        option1: self.option1,
        option2: self.option2,
        option3: self.option3,
        available: self.available,
        title: self.title,
        price: self.price,
        compare_at_price: self.compare_at_price,
        weight: self.weight,
        sku: self.sku,
      }
    end

  end
end

class ProductOption < ActiveRecord::Base # 商品选项
  belongs_to :product
  acts_as_list scope: :product
  attr_accessible :name, :value, :position
  attr_accessor :value, :first, :last # 辅助值，用于保存至商品款式中

  before_create do # 新增的选项默认值要设置到所有款式中
    product.variants.each do |variant|
      variant.update_column "option#{position}", value
    end if value.present?
  end

  before_destroy do # 更新商品所有款式
    options_size = product.options.size
    product.variants.each do |variant|
      (position...options_size).each do |i|
        variant.update_column "option#{i}", variant.send("option#{i+1}")
      end
      variant.update_column "option#{options_size}", nil
    end
  end

  def first
    self.first?
  end

  def last
    self.last?
  end

  def move!(dir)
    self.class.transaction do
      pos = self.position # move后position会改变
      if dir == -1
        self.move_higher
      elsif dir == 1
        self.move_lower
      else
        return
      end
      product.variants.each do |variant|
        tmp = variant.send("option#{pos}")
        variant.send("option#{pos}=", variant.send("option#{pos+dir}"))
        variant.send("option#{pos+dir}=", tmp)
        variant.save
      end
    end
  end
end

class Photo < ActiveRecord::Base
  belongs_to :product
  default_scope order: 'position asc'
  attr_accessible :product_image, :position
  VERSION_KEYS = []

  image_accessor :product_image do
    storage_path{ |image|
      "#{self.product.shop.id}/products/#{self.product.id}/#{image.basename}_#{rand(1000)}.#{image.format}" # data/shops/1/products/1/foo_45.jpg
    }
  end

  validates_size_of :product_image, maximum: 8000.kilobytes
  validates_with StorageValidator

  validates_property :mime_type, of: :product_image, in: %w(image/jpeg image/jpg image/png image/gif), message:  "格式不正确"

  #定义图片显示大小种类
  def self.versions(opt={})
    opt.each_pair do |k,v|
      VERSION_KEYS << k
      define_method k do
        if product_image
          product_image.thumb(v).url
        end
      end
    end
  end

  def shop # 直接使用delegate :shop, to: :product在新增商品带图片的情况下会报500错误 #416
    product ? product.shop : nil
  end

  #显示在产品列表的缩略图(icon)
  #后台管理商品详情(small)
  versions pico: '16x16', icon: '32x32', thumb: '50x50', small:'100x100', compact: '160x160', medium: '240x240', large: '480x480', grande: '600x600', original: '1024x1024'

end

CustomCollection

# app/models/tag.rb
# encoding: utf-8
class Tag < ActiveRecord::Base
  belongs_to :shop
  has_and_belongs_to_many :product
  attr_accessible :name, :category

  # 最近使用过的标签
  scope :previou_used, lambda{|c| where(category:c).order(:updated_at.desc)}

  # 分隔逗号
  def self.split(text)
    text ? text.split(/[,，]\s*/).uniq : []
  end
end

# app/liquids/product_drop.rb

#encoding: utf-8
class ProductDrop < Liquid::Drop

  def initialize(product)
    @product = product
  end

  delegate :id, :handle, :title, :url, :price, :available, :vendor, :tags, to: :@product, allow_nil: true

  def variants
    @variants ||= @product.variants.map do |variant|
      ProductVariantDrop.new variant
    end
  end

  def options
    @options ||= @product.options.map do |option|
      ProductOptionDrop.new option
    end
  end

  def images
    @images ||= @product.photos.map do |image|
      ProductImageDrop.new image
    end
  end

  def type
    @product.product_type
  end

  def price_varies
    @price_varies ||= @product.variants.map(&:price).uniq.size > 1
  end

  def price_min
    price
  end

  def compare_at_price_varies
    @compare_at_price_varies ||= @product.variants.map(&:compare_at_price).uniq.size > 1
  end

  def compare_at_price_max
    @compare_at_price_max ||= @product.variants.map(&:compare_at_price).max
  end

  def compare_at_price_min
    @compare_at_price_min ||= @product.variants.map(&:compare_at_price).min
  end

  def description
    @product.body_html
  end

  def featured_image
    @featured_image ||= ProductImageDrop.new @product.photos.first unless @product.photos.empty?
  end

  def as_json(options = nil)
    @product.shop_as_json
  end
end

class ProductImageDrop < Liquid::Drop

  def initialize(image)
    @image = image
  end

  def version(size)
    @image.send(size)
  end

end

class ProductOptionDrop < Liquid::Drop

  def initialize(option)
    @option = option
  end

  def as_json(options={})
    @option.name
  end

  def to_s
    @option.name
  end

end

# app/liquids/product_variant_drop.rb
#encoding: utf-8
class ProductVariantDrop < Liquid::Drop

  def initialize(variant)
    @variant = variant
  end

  delegate :id, :title, :price, :compare_at_price, :available, :weight, :inventory_management, :inventory_quantity, :sku, :option1, :option2, :option3, :options, :requires_shipping, to: :@variant

  #def taxable
  #  @variant.taxable
  #end

  def as_json(options = nil)
    @variant.shop_as_json
  end

end

# app/controllers/admin/product_options_controller.rb
# encoding: utf-8
class Admin::ProductOptionsController < Admin::AppController
  prepend_before_filter :authenticate_user!
  expose(:shop) { current_user.shop }
  expose(:products) { shop.products }
  expose(:product)
  expose(:product_options) { product.options }
  expose(:product_option)

  def move
    product_option.move! params[:dir].to_i
    render json: {
      options: product.options.as_json( methods: [:value, :first, :last], except: [ :created_at, :updated_at ] ),
      variants: product.variants.as_json( except: [ :created_at, :updated_at ])
    }
  end
end
# app/controllers/admin/product_variants_controller.rb
# encoding: utf-8
class Admin::ProductVariantsController < Admin::AppController
  prepend_before_filter :authenticate_user!
  expose(:shop) { current_user.shop }
  expose(:products) { shop.products }
  expose(:product)
  expose(:product_variants) { product.variants }
  expose(:product_variant)
  expose(:product_variant_json) { product_variant.to_json except: [ :created_at, :updated_at ] }

  def create
    if product_variant.save
      render json: product_variant_json
    else
      render nothing: true
    end
  end

  def update
    if product_variant.save
      render json: product_variant_json
    else
      render nothing: true
    end
  end

  # 批量修改
  def set
    operation = params[:operation]
    ids = params[:variants]
    ProductVariant.transaction do
      if operation.to_sym == :destroy
        product_variants.find(ids).map(&:destroy)
      elsif [:price, :inventory_quantity].include?(operation.to_sym)
        product_variants.find(ids).each do |variant|
          variant.update_attributes operation => params[:new_value]
        end
      end
    end
    render nothing: true
  end

  def sort
    params[:variant].each_with_index do |id, index|
      product.variants.find(id).update_attributes position: index + 1
    end
    render nothing: true
  end
end
# app/controllers/admin/products_controller.rb
#encoding: utf-8
class Admin::ProductsController < Admin::AppController
  prepend_before_filter :authenticate_user!
  layout 'admin'
  expose(:shop) { current_user.shop }
  expose(:products) do
    if params[:search]
      shop.products.metasearch(params[:search]).all
    else
      shop.products
    end
  end
  expose(:product)
  expose(:product_json) do
    product.to_json({
      include: { options: { methods: [:value, :first, :last], except: [ :created_at, :updated_at ] },photos: {methods: :icon} },
      methods: [:tags_text, :custom_collection_ids],
      except: [ :created_at, :updated_at ]
    })
  end
  expose(:variants) { product.variants }
  expose(:variants_json) { variants.to_json(except: [ :position, :created_at, :updated_at ]) }
  #expose(:variant) { variants.new }
  expose(:types) { shop.types }
  expose(:types_options) { types.map {|t| [t.name, t.name]} }
  expose(:vendors) { shop.vendors }
  expose(:vendors_options) { vendors.map {|t| [t.name, t.name]} }
  expose(:inventory_managements) { KeyValues::Product::Inventory::Manage.options }
  expose(:inventory_policies) { KeyValues::Product::Inventory::Policy.all }
  expose(:options) { KeyValues::Product::Option.all.map {|t| [t.name, t.name]} }
  expose(:tags) { shop.tags.previou_used(1) }
  expose(:custom_collections) { shop.custom_collections }
  expose(:publish_states) { KeyValues::PublishState.options }
  expose(:photos){ product.photos }
  expose(:photo){ Photo.new }
  expose(:current_sku_size){ shop.variants.size }
  expose(:shop_sku_size){ shop.plan_type.skus }

  def index
    @products_json = products.to_json({include: [:variants, :options], except: [:created_at, :updated_at],methods:[:index_photo]})
  end

  def inventory
    @product_variants = ProductVariant.joins(:product).where(inventory_management: 'shopqi', product: {shop_id: shop.id})
  end

  def new
    #保证至少有一个款式
    product.variants.build  if product.variants.empty?
  end

  def create
    images = params[:product][:images] || []
    images.each_with_index do |i,pos|
      product.photos.build(product_image: i,position: pos)
    end
    #保存商品图片
    if product.save
      shop.activities.log product,'new',current_user
      redirect_to product_path(product, new_product: true), notice: "新增商品成功!"
    else
      render action: :new
    end
  end

  def destroy
    product.destroy
    redirect_to products_path
  end

  def update
    product.save
    product.options.reject! {|option| option.destroyed?} #rails bug：使用_destroy标记删除后，需要reload后，删除集合中的元素才消失，而reload后value值将被置空
    shop.activities.log product,'edit',current_user
    render json: product_json
  end

  # 批量修改
  def set
    operation = params[:operation].to_sym
    ids = params[:products]
    if [:publish, :unpublish].include? operation #可见性
      products.where(id:ids).update_all published: (operation == :publish)
      products.where(id:ids).map{|product|log_published(product)}
    elsif operation == :destroy #删除
      products.find(ids).map(&:destroy)
    else #加入集合
      #'add_to_collection-1'
      collection_id = operation.to_s.sub 'add_to_collection-', ''
      collection = shop.custom_collections.find(collection_id)
      ids.each do |id|
        unless collection.collection_products.exists?(product_id: id)
          collection.collection_products.build product_id: id
        end
      end
      collection.save
    end
    render nothing: true
  end

  # 复制
  def duplicate
    new_product = product.dup
    new_product.variants = product.variants.map(&:dup)
    new_product.options = product.options.map(&:dup).each{|o| o.position = nil } # Fixed: #159 position不为空导致排序报错
    new_product.custom_collection_products = product.custom_collection_products.map(&:dup)
    new_product.tags_text = product.tags_text
    new_product.update_attributes title: params[:new_title]
    render json: {id: new_product.id}
  end

  #更新可见性
  def update_published
    flash.now[:notice] = I18n.t("flash.actions.update.notice")
    product.save
    log_published(product)
    render template: "shared/msg"
  end

  protected

  def log_published(product)
    handle = product.published ? 'published' : 'hidden'
    shop.activities.log product,handle,current_user
  end
end

# app/assets/javascripts/backbone/views/product_options
App.Views.ProductOption.Edit = Backbone.View.extend
  tagName: 'tr'
  className: 'edit-option'

  events:
    "click .del-option": "destroy"
    "click .resume-option": "resumeOption"
    "change .option-selector": "changeOptions"

  initialize: ->
    _.bindAll this, 'destroy', 'disableOption', 'setDefaultValue'
    @model.view = this
    @render()

  render: ->
    self = this
    position = _.indexOf @model.collection.models, @model
    cycle = if position % 2 == 0 then 'even' else 'odd'
    $(@el).addClass cycle
    attrs = _.clone @model.attributes
    attrs['destroyable'] = position isnt 0
    template = Handlebars.compile $('#edit-option-item').html()
    $(@el).html template attrs
    #选择第一个未被选择的option
    values = $('.option-selector').map -> this.value
    @$('.option-selector').children('option').each ->
      if this.value not in values
        self.$('.option-selector').val(this.value)
        false
    $('#add-option-bt').before @el
    UpdateableSelectBox @$('.option-selector'), '自定义'
    #默认值(有值时不设置默认值)
    @setDefaultValue() unless @model.attributes.value
    @disableOption()

  resumeOption: ->
    @model._destroy = false
    @$('.option-deletemsg').hide()
    @$('.option-selector-frame').show()
    @$('.delete-option-link').show()
    @$('.option-value').show()
    #已保存过的删除时要带上_destroy属性
    @$("input[name='product[options_attributes][][_destroy]']").val('0')
    false

  destroy: ->
    undestroy_product_options = _(@model.collection.models).reject (model) -> typeof(model._destroy) isnt "undefined" and model._destroy
    if undestroy_product_options.length == 1
      alert '最后一个商品选项不能删除. 商品至少需要一个选项.'
      return false
    if @model.id
      @model._destroy = true
      @$('.option-deletemsg').show()
      @$('.option-selector-frame').hide()
      @$('.delete-option-link').hide()
      @$('.option-value').hide()
      #已保存过的删除时要带上_destroy属性
      @$("input[name='product[options_attributes][][_destroy]']").val('1')
      return false
    @model.collection.remove @model
    @disableOption()
    return false

  disableOption: -> # 每个选项名称只能被选择一次
    values = $('.option-selector').map -> this.value
    $('.option-selector').each ->
      value = $(this).val()
      $(this).children('option').each ->
        val = $(this).val()
        if val and val isnt 'create_new'
          if val in values and val isnt value
            $(this).attr('disabled', true)
          else
            $(this).attr('disabled', false)
    return false

  setDefaultValue: -> # 设置默认值
    #this.$("name['product[options_attributes][][value]']").val("默认#{this.$('.option-selector > option:selected').text()}")
    value = "\u9ED8\u8BA4"
    value += @$('.option-selector > option:selected').text() if @$('.option-selector').val() isnt 'create_new'
    @$("input[name='product[options_attributes][][value]']").val(value)

  changeOptions: -> # 修改选项
    @disableOption()
    @setDefaultValue()
# app/assets/javascripts/backbone/views/product_options/index.js.coffee
App.Views.ProductOption.Index = Backbone.View.extend
  el: '#product-properties'

  events:
    "click .add-option": "addOption"

  initialize: ->
    _.bindAll this, 'addOption'
    self = this
    # 商品款式
    if @collection.length > 0
      self.render()
    $('#enable-options').change ->
      if $(this).attr('checked') is 'checked'
        if self.collection.length <= 0
          self.collection.add new App.Models.ProductOption()
        $('#create-options-frame').show()
      else
        self.collection.each (model) ->
          model.view.remove()
        self.collection.refresh []
        $('#create-options-frame').hide()
    .change()

  render: ->
    #清空原有选项
    $('#product-options-list').html('')
    $('.edit-option').remove()
    _(@collection.models).each (model) ->
      new App.Views.ProductOption.Edit model: model
      new App.Views.ProductOption.Show model: model
    @collection.showBtn()

  addOption: ->
    @collection.add new App.Models.ProductOption()
    false

# app/assets/javascripts/backbone/views/product_options/show.js.coffee
App.Views.ProductOption.Show = Backbone.View.extend
  tagName: 'tr'

  initialize: ->
    @render()

  render: ->
    return unless $('#product-options-list')[0] #商品新增页面不需要Show
    position = _.indexOf @model.collection.models, @model
    attrs = _.clone @model.attributes
    attrs['position'] = position + 1
    attrs['options'] = App.product_variants.options()["option#{position+1}"]
    template = Handlebars.compile $('#show-option-item').html()
    $(@el).html template attrs
    $('#product-options-list').append @el

# app/assets/javascripts/backbone/views/products/index/index.js.coffee
App.Views.Product.Index.Index = Backbone.View.extend
  el: '#main'

  events:
    "change .selector": 'changeProductCheckbox'
    "change #product-select": 'changeProductSelect'
    "change #select-all": 'selectAll'
    "click label img": 'click_label_img' # 修正ie无法点击图片label选中复选框的问题

  initialize: ->
    self = this
    @collection.view = this
    _.bindAll this, 'render'
    this.render()
    $.guide $('#add-prod a'), '点击此处增加一个商品', 'left' if @collection.length is 0
    $('#product-container').delegate '.variant-list-item', 'mouseover mouseout', (event) -> # 鼠标移至款式时，显示sku
      if event.type is 'mouseover'
        $('.variant-tip', this).show()
      else if event.type is 'mouseout'
        $('.variant-tip', this).hide()

  render: ->
    _(@collection.models).each (model) ->
      new App.Views.Product.Index.Show model: model

  # 商品复选框全选操作
  selectAll: ->
    @$('.selector').attr 'checked', (@$('#select-all').attr('checked') is 'checked')
    @changeProductCheckbox()

  # 商品复选框操作
  changeProductCheckbox: ->
    checked = this.$('.selector:checked')
    all_checked = (checked.size() == this.$('.selector').size())
    this.$('#select-all').attr 'checked', all_checked
    if checked[0]
      #已选中款式总数
      this.$('#product-count').text "已选中 #{checked.size()} 个商品"
      $('#product-controls').show()
    else
      $('#product-controls').hide()

  # 操作面板修改
  changeProductSelect: ->
    operation = this.$('#product-select').val()
    is_destroy = (operation is 'destroy')
    if is_destroy and !confirm('您确定要删除选中的款式吗?')
      $('#product-select').val('')
      return false
    self = this
    checked_ids = _.map self.$('.selector:checked'), (checkbox) -> checkbox.value
    $.post "/admin/products/set", operation: operation, 'products[]': checked_ids, ->
      _(checked_ids).each (id) ->
        model = App.products.get id
        if is_destroy
          $('#product-controls').hide()
          App.products.remove model
        else if operation in ['publish', 'unpublish']
          model.set published: (operation is 'publish')
      msg_text = if is_destroy then '删除' else '更新'
      msg "批量#{msg_text}成功!"
    $('#product-select').val('')
    false

  click_label_img: (event) ->
    if $.browser.msie
      id = $(event.currentTarget).parent('label').attr('for')
      $("##{id}").click().change() if id?
# app/assets/javascripts/backbone/views/products/index/show.js.coffee
App.Views.Product.Index.Show = Backbone.View.extend
  tagName: 'tr'

  events:
    "change .selector": 'select'

  initialize: ->
    self = this
    @render()
    @model.bind 'change:published', (model) ->
      self.$('.status-hidden').toggle(!model.attributes.published)
    @model.bind 'remove', (model) -> self.remove()

  render: ->
    attrs = _.clone @model.attributes
    attrs.options = _.map @model.options.models, (model) -> model.attributes
    quantities = _(attrs.variants).map (variant) -> variant.inventory_quantity
    quantities = _(quantities).select (num) -> num
    attrs.quantity_sum = '&infin;'
    if quantities.length > 0
      attrs.quantity_sum = _.reduce quantities, (memo, num) ->
        memo + num
      , 0
    template = Handlebars.compile $('#show-product-item').html()
    $(@el).html template attrs
    position = _.indexOf @model.collection.models, @model
    cycle = if position % 2 == 0 then 'odd' else 'even'
    $(@el).addClass "row #{cycle}"
    $('#product-table > tbody').append @el

  select: ->
    $(@el).toggleClass 'active', (@$('.selector').attr('checked') is 'checked')

# app/assets/javascripts/backbone/views/products/show/edit.js.coffee
App.Views.Product.Show.Edit = Backbone.View.extend
  el: '#product-edit'

  events:
    "submit form": "save"
    "click .cancel": "show"

  initialize: ->
    _.bindAll this, 'render', 'save'
    @render()

  render: ->
    template = Handlebars.compile $('#edit-product-item').html()
    attrs = _.clone @model.attributes
    $(@el).html template attrs

  save: ->
    self = this
    @model.options.each (model) -> # 循环选项，设置回model
      model.set
        name: model.view.$("input[name='product[options_attributes][][name]']").val()
        value: model.view.$("input[name='product[options_attributes][][value]']").val()
        _destroy: model.view.$("input[name='product[options_attributes][][_destroy]']").val()
    @model._changed = true #修正:只修改option item时也要触发change事件，更新列表
    @model.unset 'photos', silent: true # 有图片会报错"ActiveRecord::AssociationTypeMismatch (Photo)"，图片不是用bb处理，暂时unset
    KE.sync 'kindeditor' # issues#271
    @model.save {
        title: @$("input[name='title']").val(),
        handle: @$("input[name='handle']").val(),
        body_html: @$("textarea[name='body_html']").val(),
        product_type: @$("input[name='product_type']").val(),
        vendor: @$("input[name='vendor']").val(),
        tags_text: @$("input[name='tags_text']").val(),
        custom_collection_ids: _.map @$("input[name='product[custom_collection_ids][]']:checked"), (input) ->
          input.value
      },
      success: (model, resp) ->
        msg '修改成功!'
        self.show()
        new App.Views.ProductOption.Index collection: self.model.options # 显示商品选项
    false

  show: ->
    $('#action-links a.edit-btn').click()
    false

# app/assets/javascripts/backbone/views/products/show/index.js.coffee
App.Views.Product.Show.Index = Backbone.View.extend
  el: '#main'

  events:
    "click #action-links a.edit-btn": "toggleEdit"
    "click #action-links a.dup-btn": "showDuplicate"
    "click #duplicate_product_submit": "duplicate"
    "click #duplicate-product .cancel": "duplicateCancel"
    "click #new-variant-link p": "newVariant" # 新增款式
    "click .closure-lightbox": 'show' # 显示图片

  initialize: ->
    self = this
    Handlebars.registerHelper 'option_value', (context, block) -> # 获取款式中的option1,option2,option3等值，外围对options进行迭代，在handlebars中只能使用额外的helper实现
      [index, index_plus] = [this.index, this.index_plus]
      block(value: context["option#{index_plus}"], variant_id: context.id, index: index, index_plus: index_plus)
    # 先生成修改页面，以便查看页面获取集合名称
    new App.Views.Product.Show.Edit model: @model
    new App.Views.Product.Show.Show model: @model
    new App.Views.ProductOption.Index collection: @model.options # 商品详情中的商品选项
    new App.Views.Product.Show.Variant.Index collection: App.product_variants # 款式
    @model.bind 'change:title', (model) -> $('#product_title > a').text(model.attributes.title)
    @model.bind 'change:handle', (model) -> $('#product_title > a').attr('href', "/products/#{model.attributes.handle}")
    @model.bind 'change:options', (model) -> # 修改商品选项后要重新渲染所有款式
      i = 0
      self.model.options.each (option) ->
        i++
        if option.attributes.value
          App.product_variants.each (variant) ->
            attr = {}
            attr["option#{i}"] = option.attributes.value
            variant.set attr, silent: true
      new App.Views.Product.Show.Variant.Index collection: App.product_variants
      $('#new-variant .cancel').click() # 如果新增款式表单已经显示,会显示旧的商品选项. issue#209

  toggleEdit: ->
    $('#product-edit').toggle()
    $('#product-right-col').toggle()
    $('#product').toggle()
    false

  showDuplicate: -> # 显示复制表单
    $('#duplicate-product').show()
    $('#duplicate_product_title').val("复制 #{@model.get('title')}").focus()
    false

  duplicate: -> # 复制
    title = $('#duplicate_product_title').val()
    flag = App.current_sku_size >= App.shop_sku_size
    if flag
      error_msg '商品唯一标识符超过商店限制'
      return
    if title
      $.post "/admin/products/#{@model.id}/duplicate", new_title: title, (data) ->
        window.location = "/admin/products/#{data.id}"
      , "json"
    false

  duplicateCancel: -> # 取消复制
    $('#duplicate-product').hide()
    false

  newVariant: -> # 新增款式
    new App.Views.Product.Show.Variant.New()
    $('#new-variant-link').hide()
    $('#new-variant').show()
    Utils.Effect.scrollTo('#new-variant')
    false

  show: (e) ->
    template = Handlebars.compile $('#product-image-item').html()
    url = $(e.target).closest('a').attr('href')
    $.blockUI message: template(title: '商品图片', url: url)
    false

# /app/assets/javascripts/backbone/views/products/show/show.js.coffee
App.Views.Product.Show.Show = Backbone.View.extend
  el: '#product'

  initialize: ->
    _.bindAll this, 'render'
    @render()
    @model.bind 'change', (model) =>
      this.render()

  render: ->
    attrs = _.clone @model.attributes
    attrs['options'] = @model.options
    attrs['tags'] = StringUtils.to_a attrs.tags_text
    collections = _.map @model.attributes.custom_collection_ids, (id) ->
      collection =
        id: id
        title: $("#collection_#{id}").next('label').text()
    attrs['collections'] = collections
    attrs['collections_empty'] = _.isEmpty collections
    template = Handlebars.compile $('#show-product-item').html()
    $(@el).html template attrs

# app/assets/javascripts/backbone/views/products/show/variants/index.js.coffee
App.Views.Product.Show.Variant.Index = Backbone.View.extend

  el: '#variant-inventory'

  events:
    "change .selector": 'changeProductCheckbox'
    "change #product-select": 'changeProductSelect'
    "change #select-all": 'selectAll'
    "click #new-value .cancel": 'cancelUpdate'
    "submit form#batch-form": "saveBatchForm"
    "click .mover": 'move'

  saveBatchForm: -> # 批量操作保存
    self = this
    checked_variant_ids = _.map self.$('.selector:checked'), (checkbox) -> checkbox.value
    operation = @$('#product-select').val()
    new_value = @$("#new-value input[name='new_value']").val()
    # 复制
    if operation in ['duplicate-1', 'duplicate-2', 'duplicate-3']
      model = App.product_variants.get checked_variant_ids[0]
      attrs = _.clone model.attributes
      attrs['id'] = null
      index = operation.match(/duplicate-(\d)/)[1]
      attrs["option#{index}"] = new_value
      App.product_variants.create attrs,
        error: ->
          error_msg "SKU超出使用限制"
      @$('#product-select').val('').change()
    else
      $.post "/admin/products/#{App.product.id}/variants/set", operation: operation, new_value: new_value, 'variants[]': checked_variant_ids, ->
        _(checked_variant_ids).each (id) ->
          model = App.product_variants.get id
          if operation is 'destroy'
            $('#product-controls').hide()
            App.product_variants.remove model
          else
            attr = {}
            attr[operation] = new_value
            model.set attr
        msg "批量#{if operation is 'destroy' then '删除' else '修改'}成功!"
        self.cancelUpdate()
    false

  selectAll: -> # 款式复选框全选操作
    @$('.selector').attr 'checked', (@$('#select-all').attr('checked') is 'checked')
    @changeProductCheckbox()

  changeProductCheckbox: -> # 款式复选框操作
    checked_variants = @$('.selector:checked')
    all_checked = (checked_variants.size() == @$('.selector').size())
    @$('#select-all').attr 'checked', all_checked
    if checked_variants[0]
      #全选，则不能删除
      @$("#product-select option[value='destroy']").attr
        disabled: all_checked
      #单选，则可以复制
      @$('#product-select').children('optgroup').children().attr
        disabled: (checked_variants.size() isnt 1)
      #已选中款式总数
      @$('#product-count').text "已选中 #{checked_variants.size()} 个款式"
      $('#product-controls').show()
    else
      $('#product-controls').hide()
      @$("#new-value input[name='new_value']").val('')

  changeProductSelect: -> # 操作面板修改
    value = @$('#product-select').val()
    if value in ['price', 'inventory_quantity', 'duplicate-1', 'duplicate-2', 'duplicate-3']
      @$('#new-value').show()
      @$("#new-value input[name='new_value']").focus()
    else if value is 'destroy'
      if confirm('您确定要删除选中的款式吗?')
        @saveBatchForm()
      else
        @cancelUpdate()
    else
      @$('#new-value').hide()

  cancelUpdate: -> # 取消操作面板修改
    @$('#product-select').val('')
    @$('#new-value').hide()
    @$("#new-value input[name='new_value']").val('')
    false

  move: (event) -> # 移动选项
    option_id = $(event.currentTarget).parent('.option-title').attr('option-id')
    dir = $(event.currentTarget).closest('.mover').attr('dir')
    $.post "/admin/products/#{App.product.get('id')}/product_options/#{option_id}/move", dir: dir, (data) ->
      App.product_variants.refresh data['variants']
      product = App.product
      product.options.refresh data['options']
      product.trigger 'change:options'
      new App.Views.ProductOption.Index collection: product.options # 更新商品详情的商品选项
    false

  initialize: ->
    self = this
    @collection.view = this
    _.bindAll this, 'render'
    @render()
    # 删除集合内实体后要重新调整行class(odd, even)
    @collection.bind 'remove', (model, collection)->
      collection.each (model) ->
        index = _.indexOf collection.models, model
        cycle = if index % 2 == 0 then 'odd' else 'even'
        not_cycle = if index % 2 != 0 then 'odd' else 'even'
        model.view.$('.inventory-row').addClass(cycle).removeClass(not_cycle)
  check_skus_limited: ->
    $.get '/admin/check_skus_size'

  render: ->
    self = this
    new App.Views.Product.Show.Variant.QuickSelect collection: @collection
    $('#variants-list').html('')
    #操作区域
    template = Handlebars.compile $('#product-select-item').html()
    attrs = options: App.product.options.models
    $('#product-select').html template attrs
    template = Handlebars.compile $('#row-head-item').html()
    $('#row-head').html template attrs
    $('.option-title').hover ->
      $('.mover', this).show()
    , ->
      $('.mover', this).hide()
    _(@collection.models).each (model) ->
      new App.Views.Product.Show.Variant.Show model: model
    $('#variants-list').sortable axis: 'y', placeholder: "sortable-placeholder", handle: '.image_handle', update: (event, ui) -> #排序
      $.post "#{self.collection.url()}/sort", $(this).sortable('serialize')

# app/assets/javascripts/backbone/views/products/show/variants/new.js.coffee
App.Views.Product.Show.Variant.New = Backbone.View.extend
  el: '#new-variant'

  events:
    "submit form": "save"
    "click .cancel": "cancel"

  initialize: ->
    _.bindAll this, 'render', 'save'
    variant = App.product_variants.last() # 获取最近的款式，用于设置默认值
    @model = new App.Models.ProductVariant price: variant.get('price'), compare_at_price: variant.get('compare_at_price'), weight: variant.get('weight')
    @model.bind 'error',(model, error) ->
      container = $('#errors_for_product_variant ul')
      container.html('')
      _(error).each (err, key) ->
        container.append "<li>#{key} #{err}</li>"
      $('#errors_for_product_variant').show()
    @render()

  render: ->
    template = Handlebars.compile $('#new-variant-item').html()
    attrs = _.clone @model.attributes
    attrs['options'] = App.product.options.models
    $(@el).html template attrs

  save: ->
    attrs = Utils.Form.to_h @$('form')
    if @model.set attrs
      App.product_variants.create attrs,
        error: ->
          error_msg '商品唯一标识符超出使用限制，无法增加'
        success: (model,resp) ->
          App.current_sku_size = parseInt(App.current_sku_size) + 1
    false

  cancel: ->
    $('#new-variant-link').show()
    $('#new-variant').hide()
    false

# app/assets/javascripts/backbone/views/products/show/variants/quick_select.js.coffee

App.Views.Product.Show.Variant.QuickSelect = Backbone.View.extend
  el: '#variant-options'

  events:
    "click a": 'select'

  initialize: ->
    Handlebars.registerHelper 'each_variant_option', (variant_options, block) ->
      _(variant_options["option#{block.hash.index}"]).map (option_name) ->
        block(name: option_name)
      .join('')
    @render()

  render: ->
    #选项快捷选择
    template = Handlebars.compile $('#variant-options-item').html()
    attrs = _.clone @collection.options()
    attrs['options'] = App.product.options.models
    $(@el).html template attrs

  # 款式选项快捷选择
  select: (ev) ->
    value = $(ev.currentTarget).text()
    view = @collection.view
    if value is '所有'
      view.$('.selector').attr('checked', true)
    else if value is '清空'
      view.$('.selector').attr('checked', false)
    else
      view.$('.selector').attr('checked', false)
      attr = $(ev.currentTarget).parent('span').attr('class').replace /-/, ''
      relate_models = @collection.select (model) ->
        model.attributes[attr] is value
      _(relate_models).each (model) ->
        model.view.$('.selector').attr('checked', true)
    @collection.view.changeProductCheckbox()
    false
# app/assets/javascripts/backbone/views/products/show/variants/show.js.coffee

App.Views.Product.Show.Variant.Show = Backbone.View.extend
  tagName: 'li'

  events:
    "submit form": "save"
    "click .edit-btn": "edit"
    "click .cancel": "cancel"

  initialize: ->
    self = this
    _.bindAll this, 'render', 'edit'
    $(@el).attr 'id', "variant_#{@model.id}"
    @render()
    $('#variants-list').append @el
    @model.view = this
    # 批量修改价格、库存量
    @model.bind 'change:price', (model, price)->
      self.$('.price-cell').text price
      $("#variant-#{model.id}-price").val price
    @model.bind 'change:inventory_quantity', (model, inventory_quantity)->
      self.$('.qty-cell').text inventory_quantity
      $("#variant-inventory-quantity-#{model.id}").val inventory_quantity
    # 修改款式选项值后要更新快捷选择区域
    _([1,2,3]).each (i) ->
      self.model.bind "change:option#{i}", (model, option)->
        new App.Views.Product.Show.Variant.QuickSelect collection: model.collection
        new App.Views.ProductOption.Index collection: App.product.options
    # 删除
    @model.bind 'remove', (model)->
      new App.Views.Product.Show.Variant.QuickSelect collection: App.product_variants
      new App.Views.ProductOption.Index collection: App.product.options
      self.remove()
    # 校验
    @model.bind 'error', (model, error)->
      errors = _(error).map (err, key) ->
        "#{key} #{err}"
      .join(' ')
      error_msg  "无法保存款式: #{errors}"

  save: ->
    self = this
    @model.save Utils.Form.to_h(@$('form')),
      success: (model, resp) ->
        self.render()
        msg '修改成功!'
        self.cancel()
    false

  render: ->
    index = _.indexOf @model.collection.models, @model
    cycle = if index % 2 == 0 then 'odd' else 'even'
    template = Handlebars.compile $('#show-variant-item').html()
    attrs = _.clone @model.attributes
    attrs['options'] = App.product.options.models
    attrs['edit_td_size'] = App.product.options.length + 5
    attrs['edit_td_size_except_options'] = 5 - App.product.options.length
    attrs['is_single_variant'] = App.product.options.length is 1
    $(@el).html template attrs
    @$('.inventory-row').addClass cycle
    @$("input.requires_shipping").change()
    @$("select.inventory_management").val(@model.attributes.inventory_management).change()
    @$("input[name='product_variant[inventory_policy]'][value='#{@model.attributes.inventory_policy}']").attr('checked', true)

  edit: ->
    $('#row-head').css opacity: 0.5
    @$('.inventory-row').hide()
    @$('tr.row-edit-details').show()
    @$('tr.inventory_row').hide()
    false

  cancel: ->
    $('#row-head').removeAttr('style').css opacity: 1
    @$('.inventory-row').show()
    @$('tr.row-edit-details').hide()
    @$('tr.inventory_row').show()
    false

# app/assets/javascripts/backbone/models/product.js.coffee

# 自定义集合中会用到
App.Models.Product = Backbone.Model.extend
  name: 'product'

  initialize: (args) ->
    #backbone.rails的initialize被覆盖，导致无法获取id，需要手动调用
    this.maybeUnwrap args
    this.with_options()
    # 保存商品后要重置选项集合
    this.bind 'change:options', this.with_options

  #重载，支持子实体
  toJSON : ->
    @unset 'id', silent: true
    @unset 'shop_id', silent: true
    attrs = @wrappedAttributes()
    #手动调用_clone，因为toJSON会加wraper
    if @options?
      options_attrs = @options.models.map (model) -> model.toJSON()['product_option']
      attrs['product']['options_attributes'] = options_attrs
    attrs

  #设置关联
  with_options: ->
    if @id? and @attributes.options
      #清除原有选项
      @last_options = @options
      if @last_options
        _(@last_options.models).each (model) ->
          model.view.remove()
      #@see http://documentcloud.github.com/backbone/#FAQ-nested
      @options = new App.Collections.ProductOptions
      @options.refresh @attributes.options
      this.unset 'options', silent: true
      #找出已删除的选项，用于更新款式选项值
      if @last_options
        options_size = @last_options.length
        removed_options = _(@last_options.models).select (model) ->
          model.attributes._destroy is '1'
        _(removed_options).each (option) ->
          position = option.attributes.position
          _(App.product_variants.models).each (variant) ->
            _(_.range(position, options_size)).each (i) ->
              attr = {}
              attr["option#{i}"] = variant.get("option#{i+1}")
              variant.set attr, silent: true
    this

  addedTo: (collection) ->
    self = this
    collection.detect (model) ->
      model.attributes.product_id == self.id

# 商品选项
App.Models.ProductOption = Backbone.Model.extend
  name: 'product_option'

  toJSON : ->
    @unset 'product_id', silent: true
    @unset 'first', silent: true
    @unset 'last', silent: true
    @wrappedAttributes()

# 商品款式
App.Models.ProductVariant = Backbone.Model.extend
  name: 'product_variant'

  toJSON: ->
    @unset 'id', silent: true
    @unset 'product_id', silent: true
    @unset 'shop_id', silent: true
    @wrappedAttributes()

  validate: (attrs) ->
    return unless attrs.option1? #没有修改option值则不校验
    self = this
    i = 1
    error = {}
    # 必填
    _(App.product.options.models).each (model) ->
      unless attrs["option#{i++}"]
        error["基本选项#{model.attributes.name}"] = "不能为空!"
    # 唯一性
    exists = App.product_variants.find (variant) ->
      result = variant.id isnt self.id
      i = 1
      _(App.product.options.models).each ->
        attr = "option#{i++}"
        result = result and variant.attributes[attr] is attrs[attr]
      result
    if exists then error["基本选项"] = "已经存在!"
    error["价格"] = "不能为空!" unless attrs["price"] isnt '' # 价格、重量
    error["重量"] = "不能为空!" unless attrs["weight"] isnt ''

    #验证SKU是否超过限制
    if App.current_sku_size >= App.shop_sku_size
      error['商品SKU'] = "超过商店限制!"

    if _(error).size() is 0
      return
    else
      error

App.Collections.AvailableProducts = Backbone.Collection.extend
  model: App.Models.Product
  url: '/admin/available_products'

  initialize: ->
    self = this
    this.bind 'refresh', ->
      _(self.models).each (model) ->
        new App.Views.CustomCollection.AvailableProduct model: model

App.Collections.Products = Backbone.Collection.extend
  model: App.Models.Product

App.Collections.ProductOptions = Backbone.Collection.extend
  model: App.Models.ProductOption

  initialize: ->
    _.bindAll this, 'addOne', 'removeOne', 'showBtn'
    @bind 'add', @addOne
    @bind 'remove', @removeOne
    @bind 'all', @showBtn # 超过3个则隐藏[新增按钮]

  addOne: (model, collection) ->
    new App.Views.ProductOption.Edit model: model

  removeOne: (model, collection) ->
    model.view.remove()

  showBtn: (model, collection) ->
    if this.length >= 3
      $('#add-option-bt').hide()
    else
      $('#add-option-bt').show()


App.Collections.ProductVariants = Backbone.Collection.extend
  model: App.Models.ProductVariant

  url: ->
    "/admin/products/#{App.product.id}/variants"

  initialize: ->
    _.bindAll this, 'addOne'
    this.bind 'add', this.addOne

  addOne: (model, collection) ->
    msg '新增成功!'
    $('#new-variant-link').show()
    $('#new-variant').hide()
    new App.Views.Product.Show.Variant.Show model: model
    new App.Views.Product.Show.Variant.QuickSelect collection: collection
    new App.Views.ProductOption.Index collection: App.product.options

  # 所有款式的选项合集
  options: ->
    #return @data if @data
    @data = option1: [], option2: [], option3: []
    _(@models).each (model) =>
      i = 1
      _(@data).each (option, key) =>
        option.push model.attributes["option#{i++}"]
        @data[key] = _.uniq _.compact option
    @data


# db/migrate/20110422070212_create_products.rb
#encoding: utf-8
class CreateProducts < ActiveRecord::Migration
  def self.up
    create_table :products do |t|
      t.references :shop , comment: "Products should belong to the store" , null: false
      t.string :handle , comment: "Permalink/Handle for template", null: false
      t.string :title , comment: "Title, for example:ipod" , null: false
      t.boolean :published , comment: 'Is it visible' , default: true
      t.text :body_html , comment: 'description'
      t.float :price , comment: "Redundant (minimum style price)"
      t.string: product_type, comment: "Type (category)"
      t.string :vendor , comment: "Brand (supplier)"

      t.timestamps
    end

    #picture
    create_table :photos do |t|
      t.references :product
      t.string :product_image_uid
      t.string :product_image_format
      t.integer :position , comment: 'sort number'

      t.timestamps
    end

    #Product Style
    create_table :product_variants do |t|
      t.references :shop , comment: 'shop' , null: false
      t.references :product , comment: 'Product' , null: false
      t.float :price , comment: 'Price' , null: false , default: 0.0
      t.float :weight                , comment: '重量kg'                            , null: false    , default: 0.0
      t.float :compare_at_price , comment: 'Relative price (market price)'
      t.string :option1 , comment: 'option 1'
      t.string :option2 , comment: 'Option 2'
      t.string :option3 , comment: 'Option 3'
      t.string :sku , comment: 'Product unique identifier'
      t.boolean :requires_shipping , comment: 'Requires shipping address' , default: true
      t.integer :inventory_quantity , comment: 'Current inventory quantity'
      t.string :inventory_management , comment: 'Inventory tracking'
      t.string :inventory_policy , comment: 'What to do when inventory tracking finds out of stock: deny, continue', default: :deny

      t.timestamps
    end

    #Product Options
    create_table :product_options do |t|
      t.references :product, comment: 'Product', null: false
      t.string :name , comment: 'Name'
      t.integer :position , comment: 'Position'
    end

    add_index :products        , :shop_id
    add_index :product_variants, :product_id
    add_index :product_options , :product_id
    add_index :photos          , :product_id
  end

  def self.down
    drop_table :photos
    drop_table :product_options
    drop_table :product_variants
    drop_table :products
  end
end






