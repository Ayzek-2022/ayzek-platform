import boto3
import os
from botocore.exceptions import NoCredentialsError

# .env dosyasından ayarları çekiyoruz
ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
SECRET_KEY = os.getenv("R2_SECRET_KEY")
ENDPOINT_URL = os.getenv("R2_ENDPOINT_URL")
BUCKET_NAME = os.getenv("R2_BUCKET_NAME")
PUBLIC_DOMAIN = os.getenv("R2_PUBLIC_DOMAIN")

def upload_file_to_r2(file_obj, filename, content_type):
    """
    Dosyayı Cloudflare R2'ye yükler ve public linkini döner.
    """
    try:
        # R2 Bağlantısını Kur
        s3_client = boto3.client(
            service_name='s3',
            endpoint_url=ENDPOINT_URL,
            aws_access_key_id=ACCESS_KEY,
            aws_secret_access_key=SECRET_KEY,
            region_name='auto' # Cloudflare için hep 'auto'dur
        )

        # Dosyayı Yükle
        s3_client.upload_fileobj(
            file_obj,
            BUCKET_NAME,
            filename,
            ExtraArgs={
                'ContentType': content_type, # Resim olarak açılsın diye
                # 'ACL': 'public-read' # R2'de bazen gerekmez ama dursun
            } 
        )
        
        # Resmin internet linkini oluştur
        # Örn: https://pub-xxx.r2.dev/resim.png
        final_url = f"{PUBLIC_DOMAIN}/{filename}"
        return final_url

    except Exception as e:
        print(f"🔴 R2 Yükleme Hatası: {e}")
        return None