from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()

PAGE_KEYS = ('dashboard', 'employees', 'attendance', 'leave', 'payroll', 'profile')


def normalize_page_permissions(raw_permissions):
    permissions = {key: True for key in PAGE_KEYS}
    if isinstance(raw_permissions, dict):
        for key in PAGE_KEYS:
            if key in raw_permissions:
                permissions[key] = bool(raw_permissions[key])
    return permissions


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'page_permissions',
            'first_name',
            'last_name',
            'phone',
            'address',
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['page_permissions'] = normalize_page_permissions(data.get('page_permissions'))
        return data


class UserManageSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=False)
    page_permissions = serializers.DictField(required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'role',
            'page_permissions',
            'first_name',
            'last_name',
            'phone',
            'address',
            'is_active',
        ]
        extra_kwargs = {
            'username': {'required': True},
            'role': {'required': True},
            'email': {'required': False, 'allow_blank': True},
        }

    def validate_page_permissions(self, value):
        return normalize_page_permissions(value)

    def validate(self, attrs):
        # New user must always have a password so they can log in immediately.
        if self.instance is None and not attrs.get('password'):
            raise serializers.ValidationError({'password': 'Password is required for new user.'})
        return super().validate(attrs)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        validated_data['page_permissions'] = normalize_page_permissions(
            validated_data.get('page_permissions')
        )
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if 'page_permissions' in validated_data:
            validated_data['page_permissions'] = normalize_page_permissions(
                validated_data['page_permissions']
            )
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
