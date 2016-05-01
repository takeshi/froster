import {ClassMetadataFactory, ClassMetadata, FieldMetadataFactory, FieldMetaData} from "./util/annotation-util";
export * from "./util/annotation-util";

export interface EntityOption {
    tableName?: string;
}

export let EntityMetaFactory = new ClassMetadataFactory<EntityOption>("Entity");
export let Entity = EntityMetaFactory.decorator;
export interface EntityMetadata extends ClassMetadata<EntityOption> {
}

export interface ColumnOption {
}
export let ColumnMetaFactory = new FieldMetadataFactory<ColumnOption>("Column");
export let Column = ColumnMetaFactory.decorator;
export interface ColumnMetadata extends FieldMetaData<ColumnOption> {
}

export interface BelongsToOption {
}
export let BelongsToMetaFactory = new FieldMetadataFactory<BelongsToOption>("BelongsTo");
export let BelongsTo = BelongsToMetaFactory.decorator;
export interface BelongsToMetadata extends FieldMetaData<BelongsToOption> {
}

export interface HasManyOption {
    target: Function
}
export let HasManyMetaFactory = new FieldMetadataFactory<HasManyOption>("HasManyOption");
export let HasMany = HasManyMetaFactory.arrayDecorator;
export interface HasManyMetadata extends FieldMetaData<BelongsToOption> {
}

export interface HasOneOption {
}
export let HasOneMetaFactory = new FieldMetadataFactory<HasOneOption>("HasOneOption");
export let HasOne = HasOneMetaFactory.decorator;
export interface HasOneMetadata extends FieldMetaData<BelongsToOption> {
}
